/* Components */
import { Button } from "@/components/ui/button";
import { faChevronDown, faEllipsis, faFilePen, faSearch, faUpDown } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash, faImage, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Loader from "@/components/loader/loader";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/sidebar/appSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/admin/inputs/datePicker";
import TimePicker from "@/components/admin/inputs/timePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InputGroupPer from "@/components/admin/inputs/inputGroup";
import TextAreaAuto from "@/components/admin/inputs/textAreaAuto";


/* Types */
import type { CreateEvent, Events, UpdateEvent } from "@/types/events";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";
import type { FieldValues, UseFormReset } from "react-hook-form";

/* Hooks */
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { usePageLoader } from "@/hooks/usePageLoader";
import { useIsMobile } from "@/hooks/use-mobile";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";

/* CSS */
import "@/styles/scrollbar.css";

/* Services */
import { changeStatusEvent, createEvent, getAllEvents, getEventByID, updateEventByID, updateEventByLang, updateEventImage } from "@/services/eventsServices";

/* Config */
import { API_URL_IMAGES } from "@/config/config";
import i18n from "@/config/i18n";

/* utils */
import formatDate from "@/utils/formatDate";

export default function EventsAdmin() {
    // Hooks
    const { t } = useTranslation("translation", { keyPrefix: "admin.events" });
    const { loading, startLoading, stopLoading } = usePageLoader();
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    // States Dialogs
    const [dialogViewMore, setDialogViewMore] = useState(false);
    const [dialogUpdateVersion, setDialogUpdateVersion] = useState(false);
    const [dialogUpdate, setDialogUpdate] = useState(false);
    const [dialogUpdateImage, setDialogUpdateImage] = useState(false);
    const [dialogCreate, setDialogCreate] = useState(false);

    // States for submit form
    const [formSubmit, setFormSubmit] = useState(false);

    // States for change language
    const [loadingLanguage, setLoadingLanguage] = useState<boolean>(false);

    // Forms
    const formUpdate = useForm<UpdateEvent>({ mode: "all" });
    const formUpdateVersion = useForm<{ title: string, description: string }>({ mode: "onChange" });
    const formImage = useForm<{ image: FileList }>({ mode: "onChange" });
    const formCreate = useForm<CreateEvent>({ mode: "all" });
    const search = useForm();

    // States for dataTable
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    // States for data API
    const [data, setData] = useState<Events[]>([]);
    const [filterData, setFilterData] = useState<Events[]>([]);
    const [dataByID, setDataByID] = useState<Omit<Events, "delete_at">>();

    // Columns
    const columns: ColumnDef<Events>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        {t("table.title")}
                        <FontAwesomeIcon icon={faUpDown} />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
        },
        {
            accessorKey: "modality",
            header: ({ column }) => <div className="text-center"><Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                {t("table.modality")}
                <FontAwesomeIcon icon={faUpDown} />
            </Button>
            </div >,
            cell: ({ row }) => {
                const modality = row.getValue("modality") === "Virtual" ? t("table.virtual") : t("table.InPerson");
                return <div className="text-center font-medium">{modality}</div>;
            }
        },
        {
            accessorKey: "date",
            header: ({ column }) => <div className="text-center"><Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                {t("table.date")}
                <FontAwesomeIcon icon={faUpDown} />
            </Button>
            </div >,
            cell: ({ row }) => {
                const date = new Intl.DateTimeFormat(i18n.language, {
                    day: "2-digit",
                    "month": "2-digit",
                    "year": "numeric"
                }).format(new Date(row.getValue("date")));
                return <div className="text-center font-medium">{date}</div>;
            }
        },
        {
            accessorKey: "hour",
            header: () => <div className="text-center">{t("table.hour")}</div>,
            cell: ({ row }) => {
                const time = new Intl.DateTimeFormat(i18n.language, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }).format(new Date(`2006-06-02T${row.getValue("hour")}`));
                return <div className="text-center font-medium">{time}</div>;
            }
        },
        {
            accessorKey: "status",
            header: ({ column }) => <div className="text-center"><Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                {t("table.status")}
                <FontAwesomeIcon icon={faUpDown} />
            </Button>
            </div>,
            cell: ({ row }) => {
                const status = row.getValue("status");
                if (status == 0) return <div className="flex justify-center w-full"><div className="bg-red-500 rounded-2xl p-1 text-right font-bold w-fit  text-white ">{t("table.status0")}</div></div>;
                else return <div className="flex justify-center w-full"><div className="text-right bg-green-500 rounded-2xl  py-1 px-3 font-bold w-fit ">{t("table.status1")}</div></div>;
            }
        },
        {
            id: "actions",
            enableHiding: false,
            header: () => <div className="text-left">{t("table.actions")}</div>,
            cell: ({ row }) => {
                const event = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <FontAwesomeIcon icon={faEllipsis} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => onGetDataByID(event.id, setDialogViewMore)}>
                                {t("table.viewMore")}
                                <FontAwesomeIcon icon={faEye} />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => onGetDataByID(event.id, setDialogUpdate, undefined, formUpdate.reset, data => ({ date: data.date, hour: data.hour, modality: data.modality, address: data.address, inscription_link: data.inscription_link }))}>
                                {t("table.edit")}
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => onGetDataByID(event.id, setDialogUpdateVersion, "es", formUpdateVersion.reset, data => ({ title: data.title, description: data.description }))}>
                                {t("table.editEs")}
                                <FontAwesomeIcon icon={faFilePen} />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => onGetDataByID(event.id, setDialogUpdateVersion, "en", formUpdateVersion.reset, data => ({ title: data.title, description: data.description }))}>
                                {t("table.editEn")}
                                <FontAwesomeIcon icon={faFilePen} />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={() => onGetDataByID(event.id, setDialogUpdateImage)}>
                                {t("table.editImage")}
                                <FontAwesomeIcon icon={faImage} />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onChangeStatus(event.id, event.status == 0 ? 1 : 0)}>
                                {t("table.changeStatus")}
                                {
                                    event.status == 0 ?
                                        <FontAwesomeIcon icon={faEye} />
                                        :
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                }
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];


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
        }
    });

    // Hook for on load page
    const onLoad = useCallback(async () => {
        startLoading();
        try {
            const response = await getAllEvents();
            if (response.status === 200) {
                setData(response.data.events);
                if (search.watch("search").length > 0) {
                    setFilterData(response.data.events.filter((event) => event.title.toLowerCase().includes(search.watch("search").toLowerCase())));
                } else {
                    setFilterData(response.data.events);
                }
            }
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data.redirect) navigate(error.response?.data.redirect);
            }
            console.log(error);
        }
        finally {
            stopLoading();
        }
    }, [navigate, startLoading, stopLoading, search]);

    // Hook on get data by id in data table
    const onGetDataByID = async <T extends FieldValues>(id: number, setValue: Dispatch<SetStateAction<boolean>>, lang?: string, reset?: UseFormReset<T>, mapData?: (data: Omit<Events, "delete_at">) => T) => {
        try {
            let response;

            if (lang) response = await getEventByID(id, lang);
            else response = await getEventByID(id);

            if (response.status === 200) {
                setDataByID(response.data.events[0]);
                setValue(true);
                if (reset && mapData) {
                    reset(mapData(response.data.events[0]));
                }
            }

        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            }
            console.log(error);
        }
    };
    // Hooks forms
    const onSearch = (value: string) => {
        if (value) {
            const filter = data.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
            setFilterData(filter);
        } else {
            setFilterData(data);
        }
    };

    const onSubmitCreate = async (data: CreateEvent) => {
        setFormSubmit(true);
        try {
            const formData = new FormData();
            formData.append("title_es", data.title_es);
            formData.append("description_es", data.description_es);
            formData.append("title_en", data.title_en);
            formData.append("description_en", data.description_en);
            formData.append("date", formatDate(typeof data.date === "string" ? new Date(data.date) : data.date));
            formData.append("hour", data.hour);
            formData.append("modality", data.modality);
            formData.append("address", data.address);
            formData.append("inscription_link", data.inscription_link);
            formData.append("image", data.image[0]);

            const response = await createEvent(formData);

            if (response.status === 201) {
                toast.success(response.data.message);
                onLoad();
                setDialogCreate(false);
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

    const onSubmitUpdate = async (data: UpdateEvent) => {
        setFormSubmit(true);
        try {
            if (dataByID) {
                const formData = new URLSearchParams();
                formData.append("date", formatDate(typeof data.date === "string" ? new Date(data.date) : data.date));
                formData.append("hour", data.hour);
                formData.append("modality", data.modality);
                formData.append("address", data.address);
                formData.append("inscription_link", data.inscription_link);

                const response = await updateEventByID(dataByID.id, formData);

                if (response.status === 200) {
                    toast.success(response.data.message);
                    onLoad();
                    setDialogUpdate(false);
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
        }
    };

    const onSubmitUpdateVersion = async (data: { title: string, description: string }) => {
        setFormSubmit(true);
        try {
            if (dataByID) {
                const response = await updateEventByLang(dataByID.id, dataByID.lang, data);

                if (response.status === 200) {
                    toast.success(response.data.message);
                    onLoad();
                    setDialogUpdateVersion(false);
                }
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            formUpdateVersion.reset();
            setFormSubmit(false);
        }
    };

    const onSubmitImage = async (data: { image: FileList }) => {
        setFormSubmit(true);
        try {
            if (dataByID) {
                const formData = new FormData();
                formData.append("image", data.image[0]);

                const response = await updateEventImage(dataByID.id, formData);

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
            setFormSubmit(false);
        }
    };

    const onChangeStatus = async (id: number, status: 0 | 1) => {
        try {
            const response = await changeStatusEvent(id, status);

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


    useEffect(() => {
        onLoad();
    }, [onLoad]);

    useEffect(() => {
        onChangeLanguage(setLoadingLanguage, onLoad);
    }, [onLoad]);

    const modalityU = formUpdate.watch("modality");
    useEffect(() => {
        formUpdate.trigger("address");
        formUpdate.trigger("inscription_link");
    }, [modalityU, formUpdate]);

    const modalityC = formCreate.watch("modality");
    useEffect(() => {
        formCreate.trigger("address");
        formCreate.trigger("inscription_link");
    }, [modalityC, formCreate]);

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
                                <div>
                                    <div className="flex items-center py-4">
                                        <Input
                                            placeholder={t("table.search")}
                                            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                                            onChange={(event) => {
                                                table.getColumn("title")?.setFilterValue(event.target.value);
                                            }}
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
                                                                            header.isPlaceholder ?
                                                                                null
                                                                                :
                                                                                flexRender(header.column.columnDef.header, header.getContext())
                                                                        }
                                                                    </TableHead>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    ))}
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    table.getRowModel().rows?.length ? (
                                                        table.getRowModel().rows.map((row) =>
                                                        (
                                                            <TableRow className="text-white">
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
                                                        : (
                                                            <TableRow>
                                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                                    {t("table.noData")}
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
                                <div>
                                    {
                                        filterData.length > 0 ?
                                            filterData.map((event) => (
                                                <div className="max-w-xs mx-auto mb-5">
                                                    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden" >
                                                        <div className="block focus:outline-none focus-visible:ring-2" onClick={() => onGetDataByID(event.id, setDialogViewMore)}>
                                                            <figure className="relative h-0 pb-[56.25%] overflow-hidden">
                                                                <img className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-700 ease-out" src={`${event.image}`} width="320" height="180" alt="Course" />
                                                            </figure>
                                                        </div>
                                                        <div className="grow flex flex-col p-5 bg-[#171717]" >
                                                            <div className="grow" >
                                                                <header className="mb-3" >
                                                                    <div className="focus:outline-none focus-visible:ring-2 block" >
                                                                        <div className="flex justify-between" onClick={() => onGetDataByID(event.id, setDialogViewMore)}>
                                                                            <h3 className="text-2xl text-white font-times leading-snug">{event.title}</h3>
                                                                            <Badge className={event.status == 0 ? "bg-red-500" : "bg-green-500"}>
                                                                                {event.status == 0 ? t("table.status0") : t("table.status1")}
                                                                            </Badge>
                                                                        </div>
                                                                        <h5 className="text-lg text-gray-400">{event.address}</h5>
                                                                        <p className="mt-3 text-sm text-gray-400">{t("table.date")}: {Intl.DateTimeFormat(i18n.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(event.date))}</p>
                                                                        <p className="mt-3 text-sm text-gray-400">{t("table.hour")}: {Intl.DateTimeFormat(i18n.language, { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(`2006-06-02T${event.hour}`))}</p>
                                                                    </div>
                                                                </header>
                                                                <div className="mb-8 max-h-40 overflow-auto">
                                                                    <p>
                                                                        {event.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-500 focus:outline-none focus-visible:ring-2 hover:bg-indigo-600 text-white" onClick={() => onGetDataByID(event.id, setDialogUpdate, undefined, formUpdate.reset, data => ({ date: data.date, hour: data.hour, modality: data.modality, address: data.address, inscription_link: data.inscription_link }))} >
                                                                {t("table.edit")}
                                                            </button>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-500 focus:outline-none focus-visible:ring-2 hover:bg-indigo-600 text-white" onClick={() => onGetDataByID(event.id, setDialogUpdateVersion, "es", formUpdateVersion.reset, data => ({ title: data.title, description: data.description }))} >
                                                                {t("table.editEs")}
                                                            </button>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-500 focus:outline-none focus-visible:ring-2 hover:bg-indigo-600 text-white" onClick={() => onGetDataByID(event.id, setDialogUpdateVersion, "en", formUpdateVersion.reset, data => ({ title: data.title, description: data.description }))} >
                                                                {t("table.editEn")}
                                                            </button>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-50 focus:outline-none focus-visible:ring-2 hover:bg-indigo-100 text-indigo-500" onClick={() => onGetDataByID(event.id, setDialogUpdateImage)}>
                                                                {t("table.editImage")}
                                                            </button>
                                                            <button className="font-semibold mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-50 focus:outline-none focus-visible:ring-2 hover:bg-indigo-100 text-indigo-500" onClick={() => onChangeStatus(event.id, event.status == 0 ? 1 : 0)}>
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
            </SidebarProvider>

            {/* Dialog crear evento */}
            <Dialog open={dialogCreate} onOpenChange={setDialogCreate}>
                <DialogContent className="sm:max-w-7xl">
                    <DialogHeader>
                        <DialogTitle className="">{t("dialogs.create.titleDialog")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formCreate.handleSubmit(onSubmitCreate)}>
                        <div className="grid grid-cols-12 space-y-5 gap-5 max-h-[550px] overflow-y-auto scrollMin">
                            <div className="md:col-span-6 col-span-12">
                                <InputGroupPer
                                    id="title_es"
                                    label={t("dialogs.create.title_es")}
                                    error={formCreate.formState.errors.title_es?.message}
                                    type="text"
                                    {...formCreate.register("title_es", {
                                        required: t("errors.requiredTitle"),
                                        minLength: {
                                            value: 3,
                                            message: t("errors.minLengthTitle")
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: t("errors.maxLengthTitle")
                                        }
                                    })} />
                            </div>
                            <div className="md:col-span-6 col-span-12">
                                <InputGroupPer
                                    id="title_en"
                                    label={t("dialogs.create.title_en")}
                                    error={formCreate.formState.errors.title_en?.message}
                                    type="text"
                                    {...formCreate.register("title_en", {
                                        required: t("errors.requiredTitle"),
                                        minLength: {
                                            value: 3,
                                            message: t("errors.minLengthTitle")
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: t("errors.maxLengthTitle")
                                        }
                                    })} />
                            </div>
                            <div className="md:col-span-6 col-span-12">
                                <TextAreaAuto
                                    id="description_es"
                                    label={t("dialogs.create.description_es")}
                                    error={formCreate.formState.errors.description_es?.message}
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
                            <div className="md:col-span-6 col-span-12">
                                <TextAreaAuto
                                    id="description_en"
                                    label={t("dialogs.create.description_en")}
                                    error={formCreate.formState.errors.description_en?.message}
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
                                <Controller
                                    name="modality"
                                    control={formCreate.control}
                                    rules={{
                                        required: t("errors.requiredModality")
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <Label className="mb-3">{t("dialogs.update.modality")}</Label>
                                            <RadioGroup value={field.value} onValueChange={field.onChange} >
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="Presencial" id="r1" />
                                                    <Label htmlFor="r1">{t("dialogs.create.modality1")}</Label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="Virtual" id="r2" />
                                                    <Label htmlFor="r2">{t("dialogs.create.modality2")}</Label>
                                                </div>
                                            </RadioGroup>
                                        </>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-6 col-span-12">
                                <InputGroupPer id="address" label={t("dialogs.create.address")} error={formCreate.formState.errors.address?.message} {...formCreate.register("address", {
                                    validate: (value) => {
                                        if (value.length <= 0 && formCreate.getValues("modality") === "Presencial") return t("errors.requiredAddress");
                                    },
                                    minLength: {
                                        value: 5,
                                        message: t("errors.minLengthAddress")
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: t("errors.maxLengthAddress")
                                    }
                                })} />
                            </div>
                            <div className="md:col-span-6 col-span-12">
                                <InputGroupPer id="inscription_link" label={t("dialogs.create.inscription_link")} error={formCreate.formState.errors.inscription_link?.message} {...formCreate.register("inscription_link", {
                                    validate: (value) => {
                                        if (value.length <= 0 && formCreate.getValues("modality") === "Virtual") return t("errors.requiredInscriptionLink");

                                    },
                                    minLength: {
                                        value: 5,
                                        message: t("errors.minLengthInscription_link")
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: t("errors.maxLengthInscription_link")
                                    }
                                })} />
                            </div>
                            <div className="col-span-12 flex md:flex-row flex-col gap-5 justify-center">
                                <Controller
                                    name="date"
                                    control={formCreate.control}
                                    rules={{ required: t("errors.requiredDate") }}
                                    render={({ field }) => {
                                        return <DatePicker value={field.value} placeholder={t("dialogs.create.selectDate")} onChange={(value: Date | undefined) => field.onChange(value)} label={t("dialogs.create.date")} error={formCreate.formState.errors.date?.message} />;
                                    }}
                                />
                                <TimePicker label={t("dialogs.create.time")} error={formCreate.formState.errors.hour?.message} {...formCreate.register("hour", {
                                    required: t("errors.requiredTime")
                                })} />
                            </div>
                            <div className="col-span-12">
                                <InputGroupPer
                                    type="file"
                                    error={formCreate.formState.errors["image"]?.message}
                                    label={t("dialogs.create.image")} id="image"
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
                            <Button className="cursor-pointer" type="submit" disabled={!formCreate.formState.isValid || formSubmit}>{t("dialogs.create.submit")}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog ver más */}
            <Dialog open={dialogViewMore} onOpenChange={setDialogViewMore} >
                <DialogContent className="dark text-white" >
                    <DialogHeader>
                        <DialogTitle className="">{t("dialogs.viewMore.titleDialog")}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-12 space-y-5 justify-center max-h-[550px] overflow-y-auto scrollMin px-2" >
                        <div className="col-span-12">
                            <h3 className="text-lg  font-bold text-center">{t("dialogs.viewMore.title")}</h3>
                            <p className="text-center font-medium">
                                {dataByID?.title}
                            </p>
                        </div>
                        <div className="md:col-span-6 col-span-12 ">
                            <h3 className="text-lg font-bold">{t("dialogs.viewMore.date")}</h3>
                            <p>
                                {new Intl.DateTimeFormat(i18n.language, {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }).format(new Date(dataByID?.date || "01/01/2000"))}
                            </p>
                        </div>
                        <div className="md:col-span-6 col-span-12 ">
                            <h3 className="text-lg font-bold">{ }{t("dialogs.viewMore.date")}</h3>
                            <p>
                                {new Intl.DateTimeFormat(i18n.language, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit"
                                }).format(new Date(`2006-06-02T${dataByID?.hour || "00:00:00"}`))}
                            </p>
                        </div>
                        <div className="md:col-span-6 col-span-12   ">
                            <h3 className="text-lg font-bold">{t("dialogs.viewMore.address")}</h3>
                            <p className="max-h-40 overflow-auto">
                                {dataByID?.address || t("dialogs.viewMore.noApply")}
                            </p>
                        </div>
                        <div className="md:col-span-6 col-span-12  ">
                            <h3 className="text-lg font-bold">{t("dialogs.viewMore.inscription_link")}</h3>
                            {
                                dataByID?.inscription_link ?
                                    <a className="text-blue-500 hover:underline wrap-break-word hover:text-blue-500/50" target="_blank" href={dataByID.inscription_link}>
                                        {dataByID.inscription_link}
                                    </a>
                                    :
                                    <p className="max-h-40 overflow-auto">{t("dialogs.viewMore.noApply")}</p>
                            }
                        </div>
                        <div className="col-span-12">
                            <h3 className="text-lg font-bold ">{t("dialogs.viewMore.status")}</h3>
                            {
                                dataByID?.status == 0 ?
                                    <Badge className="text-center" variant="destructive">{t("table.status0")}</Badge>
                                    :
                                    <Badge variant="secondary" className="bg-green-500">{t("table.status1")}</Badge>
                            }
                        </div>
                        <div className="col-span-12 text-center ">
                            <h3 className="text-lg font-bold">{t("dialogs.viewMore.description")}</h3>
                            <p className="max-h-40 overflow-auto scrollMin">
                                {dataByID?.description}
                            </p>
                        </div>
                        <div className="col-span-12">
                            <img className="rounded-2xl" src={`${dataByID?.image}`} alt={dataByID?.title} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog editar evento */}
            <Dialog open={dialogUpdate} onOpenChange={setDialogUpdate}>
                <DialogContent className="text-white" >
                    <DialogHeader>
                        <DialogTitle className="">{t("dialogs.update.titleDialog")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formUpdate.handleSubmit(onSubmitUpdate)}>
                        <div className="grid grid-cols-12 space-y-5">
                            <div className="col-span-12 flex md:flex-row flex-col  gap-5 justify-center">
                                <Controller
                                    name="date"
                                    control={formUpdate.control}
                                    rules={{ required: t("errors.requiredDate") }}
                                    render={({ field }) => {
                                        return <DatePicker value={field.value} placeholder={t("dialogs.update.selectDate")} onChange={(value: Date | undefined) => field.onChange(value)} label={t("dialogs.update.date")} error={formUpdate.formState.errors.date?.message} />;
                                    }}
                                />
                                <TimePicker label={t("dialogs.update.time")} error={formUpdate.formState.errors.hour?.message} defaultValue={dataByID?.hour} {...formUpdate.register("hour", {
                                    required: t("errors.requiredTime")
                                })} />
                            </div>
                            <div className="col-span-12">
                                <Controller
                                    name="modality"
                                    control={formUpdate.control}
                                    rules={{
                                        required: t("errors.requiredModality")
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <Label className="mb-3">{t("dialogs.update.modality")}</Label>
                                            <RadioGroup value={field.value} onValueChange={field.onChange} >
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="Presencial" id="r1" />
                                                    <Label htmlFor="r1">{t("dialogs.update.modality1")}</Label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="Virtual" id="r2" />
                                                    <Label htmlFor="r2">{t("dialogs.update.modality2")}</Label>
                                                </div>
                                            </RadioGroup>
                                        </>
                                    )}
                                />
                            </div>
                            <div className="col-span-12">
                                <InputGroupPer id="address" label={t("dialogs.update.address")} error={formUpdate.formState.errors.address?.message} {...formUpdate.register("address", {
                                    validate: (value) => {
                                        if (value.length <= 0 && formUpdate.getValues("modality") === "Presencial") return t("errors.requiredAddress");
                                    },
                                    minLength: {
                                        value: 5,
                                        message: t("errors.minLengthAddress")
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: t("errors.maxLengthAddress")
                                    }
                                })} />
                            </div>
                            <div className="col-span-12">
                                <InputGroupPer id="inscription_link" label={t("dialogs.update.inscription_link")} error={formUpdate.formState.errors.inscription_link?.message} {...formUpdate.register("inscription_link", {
                                    validate: (value) => {
                                        if (value.length <= 0 && formUpdate.getValues("modality") === "Virtual") return t("errors.requiredInscriptionLink");
                                    },
                                    minLength: {
                                        value: 5,
                                        message: t("errors.minLengthInscription_link")
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: t("errors.maxLengthInscription_link")
                                    }
                                })} />
                            </div>
                        </div>
                        <DialogFooter className="mt-10">
                            <Button className="cursor-pointer" type="submit" disabled={!formUpdate.formState.isValid || formSubmit}>{t("dialogs.update.submit")}</Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>

            {/* Dialog editar versión */}
            <Dialog open={dialogUpdateVersion} onOpenChange={setDialogUpdateVersion}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="">{t("dialogs.updateVersion.titleDialog")} - {dataByID?.lang.toUpperCase()}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formUpdateVersion.handleSubmit(onSubmitUpdateVersion)} >
                        <div>
                            <InputGroupPer
                                id="title"
                                label={t("dialogs.updateVersion.title")}
                                error={formUpdateVersion.formState.errors.title?.message}
                                {...formUpdateVersion.register("title", {
                                    required: t("errors.requiredTitle"),
                                    minLength: {
                                        value: 3,
                                        message: t("errors.minLengthTitle")
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: t("errors.maxLengthTitle")
                                    }
                                })} />
                            <hr className="my-5" />
                            <TextAreaAuto
                                id="description"
                                label={t("dialogs.updateVersion.description")}
                                error={formUpdateVersion.formState.errors.description}
                                {...formUpdateVersion.register("description", {
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
                        <DialogFooter className="mt-10">
                            <Button className="cursor-pointer" type="submit" disabled={!formUpdateVersion.formState.isValid || formSubmit}>{t("dialogs.updateVersion.submit")}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog editar imágen */}
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
                                <img className="rounded-2xl" src={`${dataByID?.image}`} alt={dataByID?.title} />
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