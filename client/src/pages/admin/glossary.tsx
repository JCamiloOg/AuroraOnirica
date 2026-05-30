/* Components */
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faEllipsis, faFilePen, faSearch, faUpDown } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Loader from "@/components/loader/loader";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/sidebar/appSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/* types */
import type { CreateWord, UpdateWord, Word } from "@/types/glossary";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { FieldValues, UseFormReset } from "react-hook-form";
import type { Dispatch, SetStateAction } from "react";

/* hooks */
import { useIsMobile } from "@/hooks/use-mobile";
import { usePageLoader } from "@/hooks/usePageLoader";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import onChangeLanguage from "@/hooks/useChangeLanguage";

/* services */
import { changeStatusWord, createWord, getAllWords, getWordByID, updateWord } from "@/services/glossaryServices";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InputGroupPer from "@/components/admin/inputs/inputGroup";
import TextAreaAuto from "@/components/admin/inputs/textAreaAuto";

/* config */

/* CSS */

export default function GlossaryAdmin() {
    // Hooks
    const { t } = useTranslation("translation", { keyPrefix: "admin.glossary" });
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const isMobile = useIsMobile();

    // States dialogs
    const [dialogUpdate, setDialogUpdate] = useState(false);
    const [dialogCreate, setDialogCreate] = useState(false);

    // State cgange language
    const [loadingLanguage, setLoadingLanguage] = useState(false);

    // forms
    const formCreate = useForm<CreateWord>({ mode: "all" });
    const formUpdate = useForm<UpdateWord>({ mode: "all" });
    const search = useForm<{ search: string }>();

    // State for submit form
    const [formSubmit, setFormSubmit] = useState(false);

    // states for data table
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    // states for info API
    const [data, setData] = useState<Word[]>([]);
    const [dataByID, setDataByID] = useState<Omit<Word, "delete_at">>();
    const [filterData, setFilterData] = useState<Word[]>([]);

    // columns for table
    const columns: ColumnDef<Word>[] = [
        {
            accessorKey: "word",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {t("table.word")}
                        <FontAwesomeIcon icon={faUpDown} />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="font-medium ">{row.getValue("word")}</div>,
        },
        {
            accessorKey: "description",
            header: () => <div className="text-center flex flex-col justify-center items-center ">{t("table.definition")}</div>,
            cell: ({ row }) => {
                return <div className="flex flex-col justify-center items-center   font-medium">
                    <p className="wrap-break-word whitespace-normal text-center lg:w-3/4">{row.getValue("description")}</p>
                </div>;
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
            </div >,
            cell: ({ row }) => {
                const status = row.getValue("status");
                if (status == 0) {
                    return <div className="flex justify-center w-full">
                        <div className="bg-red-500 rounded-2xl p-1 text-right font-bold w-fit  text-white ">{t("table.status0")}</div>
                    </div>;
                } else {
                    return <div className="flex justify-center w-full">
                        <div className="text-right bg-green-500 rounded-2xl  py-1 px-3 font-bold w-fit ">{t("table.status1")}</div>
                    </div>;
                }
            }
        },
        {
            id: "actions",
            enableHiding: false,
            header: () => <div className="text-left">{t("table.actions")}</div>,
            cell: ({ row }) => {
                const word = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <FontAwesomeIcon icon={faEllipsis} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                            <DropdownMenuLabel>
                                {t("table.actions")}
                            </DropdownMenuLabel>
                            <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => onGetDataByid(word.id, setDialogUpdate, "es", formUpdate.reset, data => ({ word: data.word, description: data.description }))}>
                                {t("table.editEs")}
                                <FontAwesomeIcon icon={faFilePen} />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => onGetDataByid(word.id, setDialogUpdate, "en", formUpdate.reset, data => ({ word: data.word, description: data.description }))}>
                                {t("table.editEn")}
                                <FontAwesomeIcon icon={faFilePen} />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => onChangeStatusWord(word.id, word.status == 0 ? 1 : 0)}>
                                {t("table.changeStatus")}
                                {
                                    word.status == 0 ?
                                        <FontAwesomeIcon icon={faUpDown} />
                                        :
                                        <FontAwesomeIcon icon={faUpDown} />
                                }
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    // Data table config
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination
        }
    });


    // Hook on load page
    const onLoad = useCallback(async () => {
        startLoading();
        try {
            const response = await getAllWords();

            if (response.status === 200) {
                setData(response.data.words);
                if (search.watch("search").length > 0) {
                    setFilterData(response.data.words.filter((word) => word.word.toLocaleLowerCase().includes(search.watch("search").toLocaleLowerCase())));

                } else {
                    setFilterData(response.data.words);
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

    // hook change status
    const onChangeStatusWord = async (id: number, status: 0 | 1) => {
        try {
            console.log(id);
            const response = await changeStatusWord(id, status);

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

    // Hook on get data by id in data table
    const onGetDataByid = async <T extends FieldValues>(id: number, setValue: Dispatch<SetStateAction<boolean>>, lang?: string, reset?: UseFormReset<T>, mapData?: (data: Omit<Word, "delete_at">) => T) => {
        try {
            let response;

            if (lang) response = await getWordByID(id, lang);
            else response = await getWordByID(id);

            if (response.status === 200) {
                setDataByID(response.data.words[0]);
                setValue(true);
                if (reset && mapData) {
                    reset(mapData(response.data.words[0]));
                }
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else {
                toast.error("Something went wrong.");
            }
        }
    };
    // Hooks forms
    const onSearch = (value: string) => {
        if (value) {
            const filter = data.filter((word) => word.word.toLowerCase().includes(value.toLowerCase()));
            setFilterData(filter);
        } else {
            setFilterData(data);
        }
    };

    const onSubmitCreate = async (data: CreateWord) => {
        setFormSubmit(true);
        try {
            const response = await createWord(data);

            if (response.status === 201) {
                toast.success(response.data.message);
                setDialogCreate(false);
                onLoad();
                formCreate.reset();
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            setFormSubmit(false);
        }
    };

    const onSubmitUpdate = async (data: UpdateWord) => {
        setFormSubmit(true);
        try {
            if (dataByID) {
                const response = await updateWord(dataByID.id, data, dataByID.lang);

                if (response.status === 200) {
                    toast.success(response.data.message);
                    setDialogUpdate(false);
                    onLoad();
                    formUpdate.reset();
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
            setFormSubmit(false);
        }
    };

    useEffect(() => {
        onLoad();
    }, [onLoad]);

    useEffect(() => {
        onChangeLanguage(setLoadingLanguage, onLoad);
    }, [onLoad]);

    return (
        <>
            <Loader isVisible={loading || loadingLanguage} />
            <SidebarProvider defaultOpen={false}>
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
                                    <InputGroupInput type="text" placeholder={t("table.search")} {...search.register("search", {
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
                                <div>
                                    <div className="flex items-center py-4">
                                        <Input
                                            placeholder={t("table.search")}
                                            value={(table.getColumn("word")?.getFilterValue() as string) ?? ""}
                                            onChange={(event) => { table.getColumn("word")?.setFilterValue(event.target.value); }}
                                            className="max-w-sm"
                                        />
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="text-white ml-auto">
                                                    {t("table.columns")}
                                                    <FontAwesomeIcon icon={faChevronDown} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {
                                                    table
                                                        .getAllColumns()
                                                        .filter((column) => column.getCanHide())
                                                        .map((column) => {
                                                            return (
                                                                <DropdownMenuCheckboxItem
                                                                    key={column.id}
                                                                    className="capitalize"
                                                                    checked={column.getIsVisible()}
                                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                                >
                                                                    {column.id}
                                                                </DropdownMenuCheckboxItem>
                                                            );
                                                        })
                                                }
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="overflow-hidden rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                {
                                                    table.getHeaderGroups().map((headerGroup) => (
                                                        <TableRow key={headerGroup.id}>
                                                            {headerGroup.headers.map((header) => {
                                                                return (
                                                                    <TableHead key={header.id}>
                                                                        {
                                                                            header.isPlaceholder ? null
                                                                                :
                                                                                flexRender(header.column.columnDef.header, header.getContext())
                                                                        }
                                                                    </TableHead>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    table.getRowModel().rows?.length ? (
                                                        table.getRowModel().rows.map((row) => (
                                                            <TableRow className="text-white ">
                                                                {
                                                                    row.getVisibleCells().map((cell) => (
                                                                        <TableCell key={cell.id}>
                                                                            {
                                                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                                                            }
                                                                        </TableCell>
                                                                    ))
                                                                }
                                                            </TableRow>
                                                        ))
                                                    )
                                                        :
                                                        (
                                                            <TableRow>
                                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                                    {t("table.noResults")}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                }
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
                                                className="text-white cursor-pointer"
                                                onClick={() => table.previousPage()}
                                                disabled={!table.getCanPreviousPage()}
                                            >
                                                {t("table.buttonPrev")}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-white cursor-pointer"
                                                onClick={() => table.nextPage()}
                                                disabled={!table.getCanNextPage()}
                                            >
                                                {t("table.buttonNext")}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <>
                                    {
                                        filterData.length > 0 ?
                                            filterData.map((word) => (
                                                <div className="max-w-xs mx-auto mb-5">
                                                    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden" >
                                                        <div className="grow flex-col p-5 bg-[#171717]">
                                                            <div className="grow">
                                                                <header className="mb-3">
                                                                    <div className="focus:outline-none focus-visible:ring-2 block">
                                                                        <div className="flex justify-between">
                                                                            <h3 className="text-2xl text-white font-times leading-snug">{word.word}</h3>
                                                                            <Badge className={word.status == 0 ? "bg-red-500" : "bg-green-500"}>
                                                                                {word.status == 0 ? t("table.status0") : t("table.status1")}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </header>
                                                                <div className="mb-8 max-h-40 overflow-auto">
                                                                    <p>
                                                                        {word.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-500 focus:outline-none focus-visible:ring-2 hover:bg-indigo-600 text-white" onClick={() => onGetDataByid(word.id, setDialogUpdate, "es", formUpdate.reset, data => ({ word: data.word, description: data.description }))} >
                                                                {t("table.editEs")}
                                                            </button>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-500 focus:outline-none focus-visible:ring-2 hover:bg-indigo-600 text-white" onClick={() => onGetDataByid(word.id, setDialogUpdate, "en", formUpdate.reset, data => ({ word: data.word, description: data.description }))} >
                                                                {t("table.editEn")}
                                                            </button>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-50 focus:outline-none focus-visible:ring-2 hover:bg-indigo-100 text-indigo-500" onClick={() => onChangeStatusWord(word.id, word.status == 0 ? 1 : 0)}>
                                                                {t("table.changeStatus")}
                                                            </button>

                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            :
                                            <h2 className="text-center font-romance text-3xl">{t("table.noData")}</h2>
                                    }
                                </>
                        }
                    </div>
                </SidebarInset>
            </SidebarProvider>
            {/* Dialog create */}
            <Dialog open={dialogCreate} onOpenChange={setDialogCreate}>
                <DialogContent className="sm:max-w-7xl">
                    <DialogHeader>
                        <DialogTitle>{t("dialogs.create.titleDialog")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formCreate.handleSubmit(onSubmitCreate)}>
                        <div>
                            <div className="grid grid-cols-12 space-y-5 gap-4">
                                <div className="col-span-12 md:col-span-6">
                                    <InputGroupPer
                                        id="word_es"
                                        label={t("dialogs.create.word_es")}
                                        type="text"
                                        error={formCreate.formState.errors.word_es?.message}
                                        {...formCreate.register("word_es", {
                                            required: t("errors.requiredWord"),
                                            minLength: {
                                                value: 3,
                                                message: t("errors.minLengthWord")
                                            },
                                            maxLength: {
                                                value: 30,
                                                message: t("errors.maxLengthWord")
                                            }
                                        })}
                                    />
                                </div>

                                <div className="col-span-12 md:col-span-6">
                                    <InputGroupPer
                                        id="word_en"
                                        label={t("dialogs.create.word_en")}
                                        type="text"
                                        error={formCreate.formState.errors.word_en?.message}
                                        {...formCreate.register("word_en", {
                                            required: t("errors.requiredWord"),
                                            minLength: {
                                                value: 3,
                                                message: t("errors.minLengthWord")
                                            },
                                            maxLength: {
                                                value: 30,
                                                message: t("errors.maxLengthWord")
                                            }
                                        })}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <TextAreaAuto
                                        id="description_es"
                                        label={t("dialogs.create.definition_es")}
                                        error={formCreate.formState.errors.description_es?.message}
                                        {...formCreate.register("description_es", {
                                            required: t("errors.requiredDefinition"),
                                            minLength: {
                                                value: 10,
                                                message: t("errors.minLengthDefinition")
                                            },
                                            maxLength: {
                                                value: 5000,
                                                message: t("errors.maxLengthDefinition")
                                            }
                                        })}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <TextAreaAuto
                                        id="description_en"
                                        label={t("dialogs.create.definition_en")}
                                        error={formCreate.formState.errors.description_en?.message}
                                        {...formCreate.register("description_en", {
                                            required: t("errors.requiredDefinition"),
                                            minLength: {
                                                value: 10,
                                                message: t("errors.minLengthDefinition")
                                            },
                                            maxLength: {
                                                value: 5000,
                                                message: t("errors.maxLengthDefinition")
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-10">
                            <Button type="submit" disabled={!formCreate.formState.isValid || formSubmit}>{t("dialogs.create.submit")}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>


            {/* Dialog update */}
            <Dialog open={dialogUpdate} onOpenChange={setDialogUpdate}>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>{t("dialogs.update.titleDialog")} - {dataByID?.lang.toUpperCase()}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formUpdate.handleSubmit(onSubmitUpdate)}>
                        <div>
                            <div className="grid grid-cols-12 space-y-5 gap-4">
                                <div className="col-span-12 ">
                                    <InputGroupPer
                                        id="word"
                                        label={t("dialogs.update.word")}
                                        type="text"
                                        error={formUpdate.formState.errors.word?.message}
                                        {...formUpdate.register("word", {
                                            required: t("errors.requiredWord"),
                                            minLength: {
                                                value: 3,
                                                message: t("errors.minLengthWord")
                                            },
                                            maxLength: {
                                                value: 30,
                                                message: t("errors.maxLengthWord")
                                            }
                                        })}
                                    />
                                </div>
                                <div className="col-span-12 ">
                                    <TextAreaAuto
                                        id="description"
                                        label={t("dialogs.update.definition")}
                                        error={formUpdate.formState.errors.description?.message}
                                        {...formUpdate.register("description", {
                                            required: t("errors.requiredDefinition"),
                                            minLength: {
                                                value: 10,
                                                message: t("errors.minLengthDefinition")
                                            },
                                            maxLength: {
                                                value: 5000,
                                                message: t("errors.maxLengthDefinition")
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-10">
                            <Button type="submit" disabled={!formUpdate.formState.isValid || formSubmit}>{t("dialogs.update.submit")}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}