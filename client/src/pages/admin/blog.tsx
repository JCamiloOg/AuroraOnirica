/* Components  */
import { AppSidebar } from "@/components/admin/sidebar/appSidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Loader from "@/components/loader/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faImage } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faEllipsis, faFilePen, faSearch, faUpDown } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import InputGroupPer from "@/components/admin/inputs/inputGroup";
import TextAreaAuto from "@/components/admin/inputs/textAreaAuto";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

/* types */
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";
import type { Article, CreateArticle } from "@/types/blog";

/* Hooks */
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useCallback, useEffect, useState, } from "react";
import { usePageLoader } from "@/hooks/usePageLoader";
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";

/* Services */
import { changeStatusArticle, createArticle, getAllArticles, getArticleByID, updateArticleByLang, updateArticleImage } from "@/services/blogServices";

/* Config */
import i18n from "@/config/i18n";
import { API_URL_IMAGES } from "@/config/config";

/* CSS */
import "@/styles/scrollbar.css";

export default function BlogAdmin() {
    // Hooks
    const { t } = useTranslation("translation", { keyPrefix: "admin.blog" });
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const isMobile = useIsMobile();

    // States Dialogs
    const [dialogViewMore, setDialogViewMore] = useState(false);
    const [dialogUpdateVersion, setDialogUpdateVersion] = useState(false);
    const [dialogUpdateImage, setDialogUpdateImage] = useState(false);
    const [dialogCreate, setDialogCreate] = useState(false);

    // State change language
    const [loadingLanguage, setLoadingLanguage] = useState(false);

    // Forms
    const formUpdate = useForm<{ title: string, subtitle: string, description: string }>({ mode: "onChange" });
    const formImage = useForm<{ image: FileList }>({ mode: "onChange" });
    const formCreate = useForm<CreateArticle>({ mode: "all" });
    const search = useForm<{ search: string }>();

    // State for submit form
    const [formSubmit, setFormSubmit] = useState(false);

    // States for data table
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });


    // States for info API
    const [data, setData] = useState<Article[]>([]);
    const [dataByID, setDataByID] = useState<Omit<Article, "delete_at">>();
    const [filterData, setFilterData] = useState<Article[]>([]);

    // Columns for table
    const columns: ColumnDef<Article>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        {t("table.title")}
                        <FontAwesomeIcon icon={faUpDown} />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
        },
        {
            accessorKey: "subtitle",
            header: () => <div className="text-center">{t("table.subtitle")}</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium">{row.getValue("subtitle")}</div>;
            },
        },
        {
            accessorKey: "date",
            header: ({ column }) =>
                <div className="text-center"><Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    {t("table.date")}
                    <FontAwesomeIcon icon={faUpDown} />
                </Button>
                </div >
            ,
            cell: ({ row }) => {
                const date = new Intl.DateTimeFormat(i18n.language, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }).format(new Date(row.getValue("date")));

                return <div className="text-center font-medium">{date}</div>;
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => <div className="text-center"><Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                {t("table.status")}
                <FontAwesomeIcon icon={faUpDown} />
            </Button>
            </div >
            ,
            cell: ({ row }) => {
                const status = row.getValue("status");

                if (status == 0) {
                    return <div className="flex justify-center w-full">
                        <div className="bg-red-500 rounded-2xl p-1 text-right font-bold w-fit  text-white ">{t("table.status0")}</div>
                    </div>;
                }
                else {
                    return <div className="flex justify-center w-full">
                        <div className="text-right bg-green-500 rounded-2xl  py-1 px-3 font-bold w-fit ">{t("table.status1")}</div>
                    </div>;

                };
            },
        },
        {
            id: "actions",
            enableHiding: false,
            header: () => <div className="text-left">{t("table.actions")}</div>,
            cell: ({ row }) => {
                const article = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <FontAwesomeIcon icon={faEllipsis} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="dark" align="center">
                            <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onGetDataByid(article.id, setDialogViewMore)} className="flex justify-between cursor-pointer">
                                {t("table.viewMore")}
                                <FontAwesomeIcon icon={faEye} />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onGetDataByid(article.id, setDialogUpdateVersion, "es")} className="flex justify-between cursor-pointer">
                                {t("table.editEs")}
                                <FontAwesomeIcon icon={faFilePen} />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onGetDataByid(article.id, setDialogUpdateVersion, "en")} className="flex justify-between cursor-pointer">
                                {t("table.editEn")}
                                <FontAwesomeIcon icon={faFilePen} />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onGetDataByid(article.id, setDialogUpdateImage)} className="flex justify-between cursor-pointer">
                                {t("table.editImage")}
                                <FontAwesomeIcon icon={faImage} />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onChangeStatusArticle(article.id, article.status == 0 ? 1 : 0)} className="flex justify-between cursor-pointer">
                                {t("table.changeStatus")}
                                {
                                    article.status == 0 ?
                                        <FontAwesomeIcon icon={faEye} />
                                        :
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                }
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    //  data table config
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination
        },
    });

    // Hook on load page
    const onLoad = useCallback(async () => {
        startLoading();
        try {
            const response = await getAllArticles();

            if (response.status === 200) {
                setData(response.data.articles);
                if (search.watch("search").length > 0) {
                    setFilterData(response.data.articles.filter((article) => article.title.toLowerCase().includes(search.watch("search").toLowerCase())));
                } else {
                    setFilterData(response.data.articles);

                }
            }
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data.redirect) navigate(error.response?.data.redirect);
            }
            console.log(error);
        } finally {
            stopLoading();
        }
    }, [navigate, stopLoading, startLoading, search]);

    // Hook change status
    const onChangeStatusArticle = async (id: number, status: 0 | 1) => {
        try {
            const response = await changeStatusArticle(id, status);

            if (response.status === 200) {
                toast.success(response.data.message);
                onLoad();
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else {
                toast.error("Something went wrong.");
            }
        }
    };
    // Hook on get data by ID in data table
    const onGetDataByid = async (id: number, setValue: Dispatch<SetStateAction<boolean>>, lang?: string) => {
        try {
            let response;

            if (lang) response = await getArticleByID(id, lang);
            else response = await getArticleByID(id);


            if (response.status === 200) {
                setDataByID(response.data.articles[0]);
                setValue(true);
            }

        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else {
                toast.error("Something went wrong.");
            }

        }
    };

    /* Hooks on submits */
    const onSubmitCreate = async (data: CreateArticle) => {
        setFormSubmit(true);
        try {
            const formData = new FormData();
            formData.append("title_es", data.title_es);
            formData.append("subtitle_es", data.subtitle_es);
            formData.append("description_es", data.description_es);
            formData.append("title_en", data.title_en);
            formData.append("subtitle_en", data.subtitle_en);
            formData.append("description_en", data.description_en);
            formData.append("image", data.image[0]);

            const response = await createArticle(formData);

            if (response.status === 201) {
                toast.success(response.data.message);
                setDialogCreate(false);
            }

        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            formCreate.reset();
            onLoad();
            setFormSubmit(false);
            setDialogCreate(false);

        }
    };

    const onSubmitUpdate = async (data: { title: string, subtitle: string, description: string }) => {
        setFormSubmit(true);
        try {
            if (dataByID) {
                const response = await updateArticleByLang(dataByID.id, dataByID.lang, data);

                if (response.status === 200) {
                    toast.success(response.data.message);
                    onLoad();
                    setDialogUpdateVersion(false);
                }
            } else {
                toast.error(t("dialogs.updateVersion.errors.noData"));
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            formUpdate.reset();
            setFormSubmit(false);
            setDataByID(undefined);
        }
    };

    const onSearch = (value: string) => {
        if (value.length > 0) {
            const filter = data.filter((article) => article.title.toLowerCase().includes(value.toLowerCase()));
            setFilterData(filter);
        } else {
            setFilterData(data);
        }
    };

    const onSubmitImage = async (data: { image: FileList }) => {
        setFormSubmit(true);
        try {
            if (dataByID) {
                const formData = new FormData();
                formData.append("image", data.image[0]);

                const response = await updateArticleImage(dataByID.id, formData);

                if (response.status === 200) {
                    toast.success(response.data.message);
                    setDialogUpdateImage(false);
                }
            } else {
                toast.error(t("dialogs.updateVersion.errors.noData"));
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            formImage.reset();
            setDialogUpdateImage(false);
            setFormSubmit(false);
            setDataByID(undefined);
        }
    };


    useEffect(() => {
        onLoad();
    }, [onLoad]);

    useEffect(() => {
        formUpdate.reset();
    }, [dialogUpdateVersion, dialogUpdateImage, formUpdate]);

    useEffect(() => {
        onChangeLanguage(setLoadingLanguage, onLoad);
    }, [onLoad]);
    return (
        <>
            <Loader isVisible={loading || loadingLanguage} />
            <SidebarProvider defaultOpen={false} className="dark">
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="dark cursor-pointer text-white -ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb >
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <Link to="/">
                                            {t("header.link")}
                                        </Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{t("header.title")}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="px-2 mx-2">
                        <h2 className="font-romance text-white text-center text-3xl my-5">{t("title")}</h2>
                        <div className="flex justify-between gap-4">
                            <Button onClick={() => setDialogCreate(true)} className="cursor-pointer mb-5">{t("table.add")}</Button>
                            <div className="block md:hidden">
                                <InputGroup>
                                    <InputGroupInput type="text" placeholder="Buscar por título..." {...search.register("search", {
                                        onChange: (e) => onSearch(e.target.value)
                                    })} />
                                    <InputGroupAddon align="inline-end">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </div>
                        {
                            !isMobile ?
                                <div className="">
                                    <div className="flex items-center py-4">
                                        <Input
                                            placeholder={t("table.search")}
                                            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                                            onChange={(event) =>
                                                table.getColumn("title")?.setFilterValue(event.target.value)
                                            }
                                            className="max-w-sm"
                                        />
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="text-white ml-auto">
                                                    {t("table.columns")} <FontAwesomeIcon icon={faChevronDown} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="dark" align="end">
                                                {table
                                                    .getAllColumns()
                                                    .filter((column) => column.getCanHide())
                                                    .map((column) => {
                                                        return (
                                                            <DropdownMenuCheckboxItem
                                                                key={column.id}
                                                                className="capitalize"
                                                                checked={column.getIsVisible()}
                                                                onCheckedChange={(value) =>
                                                                    column.toggleVisibility(!!value)
                                                                }
                                                            >
                                                                {column.id}
                                                            </DropdownMenuCheckboxItem>
                                                        );
                                                    })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="overflow-hidden rounded-md border">
                                        <Table className="dark">
                                            <TableHeader >
                                                {table.getHeaderGroups().map((headerGroup) => (
                                                    <TableRow key={headerGroup.id}>
                                                        {headerGroup.headers.map((header) => {
                                                            return (
                                                                <TableHead key={header.id}>
                                                                    {header.isPlaceholder
                                                                        ? null
                                                                        : flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )}
                                                                </TableHead>
                                                            );
                                                        })}
                                                    </TableRow>
                                                ))}
                                            </TableHeader>
                                            <TableBody>
                                                {table.getRowModel().rows?.length ? (
                                                    table.getRowModel().rows.map((row) => (
                                                        <TableRow className="text-white"
                                                            key={row.id}
                                                        // data-state={row.getIsSelected() && "selected"}
                                                        >
                                                            {row.getVisibleCells().map((cell) => (
                                                                <TableCell key={cell.id}>
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={columns.length}
                                                            className="h-24 text-center"
                                                        >
                                                            {t("table.noData")}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex items-center justify-between space-x-2 py-4">
                                        <div className="text-white">
                                            {t("table.page")} {table.getState().pagination.pageIndex + 1}  {t("table.of")}{" "}
                                            {table.getPageCount()}
                                        </div>
                                        <div className="space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-white"
                                                onClick={() => table.previousPage()}
                                                disabled={!table.getCanPreviousPage()}
                                            >
                                                {t("table.buttonPrev")}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-white"
                                                onClick={() => table.nextPage()}
                                                disabled={!table.getCanNextPage()}
                                            >
                                                {t("table.buttonNext")}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div>
                                    {
                                        filterData.length > 0 ?
                                            filterData.map((article) => (
                                                <div className="max-w-xs mx-auto mb-5">
                                                    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden">
                                                        <div className="block focus:outline-none focus-visible:ring-2" onClick={() => onGetDataByid(article.id, setDialogViewMore)}>
                                                            <figure className="relative h-0 pb-[56.25%] overflow-hidden">
                                                                <img className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-700 ease-out" src={`${article.main_image}`} width="320" height="180" alt="Course" />
                                                            </figure>
                                                        </div>
                                                        <div className="grow flex flex-col p-5 bg-[#171717]">
                                                            <div className="grow">
                                                                <header className="mb-3">
                                                                    <div className="focus:outline-none focus-visible:ring-2 block" >
                                                                        <div className="flex justify-between" onClick={() => onGetDataByid(article.id, setDialogViewMore)}>
                                                                            <h3 className="text-2xl text-white font-times leading-snug">{article.title}</h3>
                                                                            <Badge className={article.status == 0 ? "bg-red-500" : "bg-green-500"}>
                                                                                {article.status == 0 ? t("table.status0") : t("table.status1")}
                                                                            </Badge>
                                                                        </div>
                                                                        <h5 className="text-lg font-liberation text-gray-400">{article.subtitle}</h5>
                                                                        <p className="mt-3 text-sm text-gray-400">{t("table.date")}: {Intl.DateTimeFormat(i18n.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(article.date))}</p>
                                                                    </div>
                                                                </header>
                                                                <div className="mb-8 max-h-40 overflow-auto">
                                                                    <p>
                                                                        {article.text}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-500 focus:outline-none focus-visible:ring-2 hover:bg-indigo-600 text-white" onClick={() => onGetDataByid(article.id, setDialogUpdateVersion, "es")} >
                                                                {t("table.editEs")}
                                                            </button>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-500 focus:outline-none focus-visible:ring-2 hover:bg-indigo-600 text-white" onClick={() => onGetDataByid(article.id, setDialogUpdateVersion, "en")} >
                                                                {t("table.editEn")}
                                                            </button>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-50 focus:outline-none focus-visible:ring-2 hover:bg-indigo-100 text-indigo-500" onClick={() => onGetDataByid(article.id, setDialogUpdateImage)}>
                                                                {t("table.editImage")}
                                                            </button>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-50 focus:outline-none focus-visible:ring-2 hover:bg-indigo-100 text-indigo-500" onClick={() => onChangeStatusArticle(article.id, article.status == 0 ? 1 : 0)}>
                                                                {t("table.changeStatus")}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            :
                                            <h2 className="text-center font-romance text-3xl">{t("table.noData")}</h2>
                                    }
                                </div>
                        }
                    </div>
                </SidebarInset>
            </SidebarProvider >
            {/* Dialog crear */}
            <Dialog open={dialogCreate} onOpenChange={setDialogCreate} >
                <DialogContent className="dark text-white sm:max-w-7xl"  >
                    <DialogHeader>
                        <DialogTitle>{t("dialogs.create.titleDialog")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formCreate.handleSubmit(onSubmitCreate)} >
                        <div className="grid grid-cols-12 space-y-5 gap-4 max-h-[550px] overflow-auto" >
                            <div className="col-span-12 md:col-span-6">
                                <InputGroupPer
                                    id="title_es"
                                    label={t("dialogs.create.title_es")}
                                    type="text" error={formCreate.formState.errors["title_es"]?.message}
                                    {...formCreate.register("title_es", {
                                        required: t("errors.requiredTitle"),
                                        minLength: {
                                            value: 3,
                                            message: t("errors.minLengthTitle")
                                        },
                                    })} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <InputGroupPer
                                    id="title_en"
                                    label={t("dialogs.create.title_en")}
                                    type="text" error={formCreate.formState.errors["title_en"]?.message}
                                    {...formCreate.register("title_en", {
                                        required: t("errors.requiredTitle"),
                                        minLength: {
                                            value: 3,
                                            message: t("errors.minLengthTitle")
                                        },
                                    })} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <InputGroupPer
                                    id="subtitle_es"
                                    label={t("dialogs.create.subtitle_es")}
                                    type="text" error={formCreate.formState.errors["subtitle_es"]?.message}
                                    {...formCreate.register("subtitle_es", {
                                        required: t("errors.requiredSubtitle"),
                                        minLength: {
                                            value: 3,
                                            message: t("errors.minLengthSubtitle")
                                        },
                                    })} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <InputGroupPer
                                    id="subtitle_en"
                                    label={t("dialogs.create.subtitle_en")}
                                    type="text" error={formCreate.formState.errors["subtitle_en"]?.message}
                                    {...formCreate.register("subtitle_en", {
                                        required: t("errors.requiredSubtitle"),
                                        minLength: {
                                            value: 3,
                                            message: t("errors.minLengthSubtitle")
                                        },
                                    })} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <TextAreaAuto
                                    id="description_es"
                                    label={t("dialogs.create.description_es")}
                                    error={formCreate.formState.errors["description_es"]?.message}
                                    {...formCreate.register("description_es", {
                                        required: t("errors.requiredDescription"),
                                        minLength: {
                                            value: 50,
                                            message: t("errors.minLengthDescription")
                                        },
                                        maxLength: {
                                            value: 20000,
                                            message: t("errors.maxLengthDescription")
                                        }
                                    })} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <TextAreaAuto
                                    id="description_en"
                                    label={t("dialogs.create.description_en")}
                                    error={formCreate.formState.errors["description_en"]?.message}
                                    {...formCreate.register("description_en", {
                                        required: t("errors.requiredDescription"),
                                        minLength: {
                                            value: 50,
                                            message: t("errors.minLengthDescription")
                                        },
                                        maxLength: {
                                            value: 20000,
                                            message: t("errors.maxLengthDescription")
                                        }
                                    })} />
                            </div>
                            <div className="col-span-12">
                                <InputGroupPer
                                    id="image"
                                    label={t("dialogs.create.image")}
                                    type="file"
                                    error={formCreate.formState.errors["image"]?.message}
                                    accept="image/jpg, image/jpeg, image/png, image/webp"
                                    {...formCreate.register("image", {
                                        required: t("errors.requiredImage"),
                                        validate: {
                                            fileExt: (files: FileList) => {
                                                return ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(files[0].type) || t("errors.imageExt");
                                            }
                                        }
                                    })} />
                            </div>
                        </div>
                        <DialogFooter className="mt-10">
                            <Button className="cursor-pointer" disabled={!formCreate.formState.isValid || formSubmit} type="submit">
                                {t("dialogs.create.submit")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Dialog ver más */}
            <Dialog open={dialogViewMore} onOpenChange={setDialogViewMore} >
                <DialogContent className="dark text-white" >
                    <DialogHeader>
                        <DialogTitle>{t("dialogs.viewMore.titleDialog")}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-12 space-y-5 max-h-[550px] scrollMin overflow-auto">
                        <div className="col-span-12 md:col-span-6">
                            <h3 className="text-lg font-bold">{t("dialogs.viewMore.title")}</h3>
                            <p>
                                {dataByID?.title}
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <h3 className="text-lg font-bold">{t("dialogs.viewMore.subtitle")}</h3>
                            <p>
                                {dataByID?.subtitle}
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <h3 className="text-lg font-bold">{ }{t("dialogs.viewMore.date")}</h3>
                            <p>
                                {new Intl.DateTimeFormat(i18n.language, {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }).format(new Date(dataByID?.date || "01/01/2000"))}
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <h3 className="text-lg font-bold">{t("dialogs.viewMore.status")}</h3>
                            {
                                dataByID?.status == 0 ?
                                    <Badge variant="destructive">{t("table.status0")}</Badge>
                                    :
                                    <Badge variant="secondary" className="bg-green-500">{t("table.status1")}</Badge>
                            }
                        </div>
                        <div className="col-span-12 text-center ">
                            <h3 className="text-lg font-bold">{t("dialogs.viewMore.description")}</h3>
                            <p className="max-h-40 overflow-auto scrollMin">
                                {dataByID?.text}
                            </p>
                        </div>
                        <div className="col-span-12">
                            <img className="rounded-2xl" src={`${dataByID?.main_image}`} alt={dataByID?.title} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog editar versión */}
            <Dialog open={dialogUpdateVersion} onOpenChange={setDialogUpdateVersion} >
                <DialogContent className="dark text-white sm:max-w-2xl" >
                    <DialogHeader>
                        <DialogTitle>{t("dialogs.updateVersion.titleDialog")} - {dataByID?.lang.toUpperCase()}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formUpdate.handleSubmit(onSubmitUpdate)} >

                        <div className="grid grid-cols-12 space-y-5 md:gap-4 max-h-[550px] overflow-auto">
                            <div className="col-span-12 md:col-span-6">
                                <InputGroupPer
                                    defaultValue={dataByID?.title || ""}
                                    error={formUpdate.formState.errors["title"]?.message}
                                    label={t("dialogs.updateVersion.title")}
                                    id="title"
                                    type="text"
                                    {...formUpdate.register("title", {
                                        required: t("errors.requiredTitle"),
                                        minLength: {
                                            value: 3,
                                            message: t("errors.minLengthTitle")
                                        },
                                        maxLength: {
                                            value: 40,
                                            message: t("errors.maxLengthTitle")
                                        }
                                    })} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <InputGroupPer
                                    defaultValue={dataByID?.subtitle || ""}
                                    error={formUpdate.formState.errors["subtitle"]?.message}
                                    label={t("dialogs.updateVersion.subtitle")}
                                    type="text"
                                    id="subtitle"
                                    {...formUpdate.register("subtitle", {
                                        required: t("errors.requiredSubtitle"),
                                        minLength: {
                                            value: 3,
                                            message: t("errors.minLengthSubtitle")
                                        },
                                        maxLength: {
                                            value: 40,
                                            message: t("errors.maxLengthSubtitle")
                                        }
                                    })} />
                            </div>
                            <div className="col-span-12">
                                <TextAreaAuto
                                    defaultValue={dataByID?.text || ""}
                                    error={formUpdate.formState.errors["description"]?.message}
                                    label={t("dialogs.updateVersion.description")}
                                    id="description"
                                    {...formUpdate.register("description", {
                                        required: t("errors.requiredDescription"),
                                        minLength: {
                                            value: 50,
                                            message: t("errors.minLengthDescription")
                                        },
                                        maxLength: {
                                            value: 20000,
                                            message: t("errors.maxLengthDescription")
                                        }
                                    })} />
                            </div>
                        </div>
                        <DialogFooter className="mt-10">
                            <Button className="cursor-pointer" disabled={!formUpdate.formState.isValid || formSubmit} type="submit">
                                {t("dialogs.updateVersion.submit")}
                            </Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>

            {/* Dialog editar imagen */}
            <Dialog open={dialogUpdateImage} onOpenChange={setDialogUpdateImage} >
                <DialogContent className="dark text-white">
                    <DialogHeader>
                        <DialogTitle>{t("dialogs.updateImage.titleDialog")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formImage.handleSubmit(onSubmitImage)}>
                        <div>
                            <div className="mb-10">
                                <InputGroupPer
                                    type="file"
                                    error={formImage.formState.errors["image"]?.message}
                                    label={t("dialogs.updateImage.image")} id="image"
                                    accept="image/jpg, image/jpeg, image/png, image/webp"
                                    {...formImage.register("image", {
                                        required: t("errors.requiredImage"),
                                        validate: {
                                            fileExt: (files: FileList) => {
                                                return ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(files[0].type) || t("errors.imageExt");
                                            }
                                        }
                                    })} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-romance mb-4">{t("dialogs.updateImage.currentImage").toUpperCase()}</h4>
                                <img className="rounded-2xl" src={`${dataByID?.main_image}`} alt={dataByID?.title} />
                            </div>
                        </div>
                        <DialogFooter className="mt-10">
                            <Button className="cursor-pointer" disabled={!formImage.formState.isValid || formSubmit} type="submit">
                                {t("dialogs.updateImage.submit")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}