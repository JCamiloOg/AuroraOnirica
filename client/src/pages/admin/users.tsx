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
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faEllipsis, faFilePen, faSearch, faUpDown } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import InputGroupPer from "@/components/admin/inputs/inputGroup";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

/* types */
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";
import type { UpdateUser, User } from "@/types/users";

/* Hooks */
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useCallback, useEffect, useState, } from "react";
import { usePageLoader } from "@/hooks/usePageLoader";
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { toast } from "sonner";
import { useForm, type FieldValues, type UseFormReset } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile";

/* Services */
import { createUser, getAllUsers, getUserByID, updateStatus, updateUser } from "@/services/userServices";

export default function UsersAdmin() {
    // Hooks
    const { t } = useTranslation("translation", { keyPrefix: "admin.users" });
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const isMobile = useIsMobile();

    const [dialogCreate, setDialogCreate] = useState(false);
    const [dialogUpdate, setDialogUpdate] = useState(false);

    // State change language
    const [loadingLanguage, setLoadingLanguage] = useState(false);

    // Forms
    const formUpdate = useForm<UpdateUser>({ mode: "onChange" });
    const formCreate = useForm<Pick<User, "username" | "password">>({ mode: "all" });
    const search = useForm<{ search: string }>();

    // State for submit form
    const [formSubmit, setFormSubmit] = useState(false);

    // States for data table
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    // States for info API
    const [data, setData] = useState<User[]>([]);
    const [dataByID, setDataByID] = useState<Omit<User, "delete_at">>();
    const [filterData, setFilterData] = useState<User[]>([]);

    // Columns for table
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "username",
            header: () => {
                return (<div className="">{t("table.username")}</div>
                );
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("username")}</div>,
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
                const username = row.original;

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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onGetDataByID(username.id, setDialogUpdate, formUpdate.reset, data => ({ username: data.username }))} className="flex justify-between cursor-pointer">
                                {t("table.edit")}
                                <FontAwesomeIcon icon={faFilePen} />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onChangeStatus(username.id, username.status == 0 ? 1 : 0)} className="flex justify-between cursor-pointer">
                                {t("table.changeStatus")}
                                {
                                    username.status == 0 ?
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
            const response = await getAllUsers();
            if (response.status === 200) {
                setData(response.data.users);
                if (search.watch("search").length > 0) {
                    setFilterData(response.data.users.filter((user) => user.username.toLowerCase().includes(search.watch("search").toLowerCase())));
                } else {
                    setFilterData(response.data.users);
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

    const onGetDataByID = async <T extends FieldValues>(id: number, setValue: Dispatch<SetStateAction<boolean>>, reset?: UseFormReset<T>, mapData?: (data: Omit<User, "delete_at">) => T) => {
        try {
            const response = await getUserByID(id);
            if (response.status === 200) {
                setDataByID(response.data.user);
                setValue(true);
                if (reset && mapData) {
                    reset(mapData(response.data.user));
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
            const filter = data.filter((item) => item.username.toLowerCase().includes(value.toLowerCase()));
            setFilterData(filter);
        } else {
            setFilterData(data);
        }
    };

    const onSubmitCreate = async (data: Pick<User, "username" | "password">) => {
        setFormSubmit(true);
        try {
            const response = await createUser(data);

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

    const onSubmitUpdate = async (data: UpdateUser) => {
        setFormSubmit(true);
        try {
            if (dataByID) {

                const response = await updateUser(dataByID.id, data);

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

    const onChangeStatus = async (id: number, status: 0 | 1) => {
        try {
            const response = await updateStatus(id, status);

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
                                    <InputGroupInput className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" placeholder="Buscar por usuario..." {...search.register("search", {
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
                                            type="number"

                                            placeholder={t("table.search")}
                                            value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                                            onChange={(event) => {
                                                table.getColumn("username")?.setFilterValue(event.target.value);
                                            }}
                                            className="max-w-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                                <>
                                    {
                                        filterData.length > 0 ?
                                            filterData.map((user) => (
                                                <div className="max-w-xs mx-auto mb-5">
                                                    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden" >
                                                        <div className="grow flex-col p-5 bg-[#171717]">
                                                            <div className="grow">
                                                                <header className="mb-3">
                                                                    <div className="focus:outline-none focus-visible:ring-2 block">
                                                                        <div className="flex justify-between">
                                                                            <h3 className="text-2xl text-white font-romance leading-snug">{user.username}</h3>
                                                                            <Badge className={user.status == 0 ? "bg-red-500" : "bg-green-500"}>
                                                                                {user.status == 0 ? t("table.status0") : t("table.status1")}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </header>
                                                                <div className="mb-8 max-h-40 overflow-auto">
                                                                </div>
                                                            </div>
                                                            <button className="font-semibold mb-3 me-5 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-500 focus:outline-none focus-visible:ring-2 hover:bg-indigo-600 text-white" onClick={() => onGetDataByID(user.id, setDialogUpdate, formUpdate.reset, data => ({ username: data.username }))} >
                                                                {t("table.edit")}
                                                            </button>
                                                            <button className="font-semibold cursor-pointer mb-3 text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-50 focus:outline-none focus-visible:ring-2 hover:bg-indigo-100 text-indigo-500" onClick={() => onChangeStatus(user.id, user.status == 0 ? 1 : 0)}>
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
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>{t("dialogs.create.titleDialog")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formCreate.handleSubmit(onSubmitCreate)}>
                        <div>
                            <div className="grid grid-cols-12 space-y-5 gap-4">
                                <div className="col-span-12">
                                    <InputGroupPer
                                        id="username"
                                        label={t("dialogs.create.username")}
                                        type="text"
                                        error={formCreate.formState.errors.username?.message}
                                        {...formCreate.register("username", {
                                            required: t("errors.requiredUser"),
                                            minLength: {
                                                value: 8,
                                                message: t("errors.minLengthUser")
                                            },
                                            maxLength: {
                                                value: 15,
                                                message: t("errors.maxLengthUser")
                                            }
                                        })}
                                    />
                                </div>
                                <div className="col-span-12">
                                    <InputGroupPer
                                        type="password"
                                        id="password"
                                        label={t("dialogs.create.password")}
                                        error={formCreate.formState.errors.password?.message}
                                        {...formCreate.register("password", {
                                            required: t("errors.requiredPassword"),
                                            minLength: {
                                                value: 8,
                                                message: t("errors.minLengthPassword")
                                            },
                                            maxLength: {
                                                value: 20,
                                                message: t("errors.maxLengthPassword")
                                            },
                                            pattern: {
                                                value: /^(?=.*[A-Z])(?=(.*\d){3,}).{8,}$/,
                                                message: t("errors.patternPassword")
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
                        <DialogTitle>{t("dialogs.update.titleDialog")} - {dataByID?.username}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formUpdate.handleSubmit(onSubmitUpdate)}>
                        <div>
                            <div className="grid grid-cols-12 space-y-5 gap-4">
                                <div className="col-span-12 ">
                                    <InputGroupPer
                                        id="username"
                                        label={t("dialogs.update.username")}
                                        type="text"
                                        error={formUpdate.formState.errors.username?.message}
                                        {...formUpdate.register("username", {
                                            required: t("errors.requiredUser"),
                                            minLength: {
                                                value: 8,
                                                message: t("errors.minLengthUser")
                                            },
                                            maxLength: {
                                                value: 15,
                                                message: t("errors.maxLengthUser")
                                            },
                                        })}
                                    />
                                </div>
                                <div className="col-span-12 ">
                                    <InputGroupPer
                                        type="password"
                                        id="description"
                                        label={t("dialogs.update.password")}
                                        error={formUpdate.formState.errors.password?.message}
                                        {...formUpdate.register("password", {
                                            minLength: {
                                                value: 8,
                                                message: t("errors.minLengthPassword")
                                            },
                                            maxLength: {
                                                value: 20,
                                                message: t("errors.maxLengthPassword")
                                            },
                                            pattern: {
                                                value: /^(?=.*[A-Z])(?=(.*\d){3,}).{8,}$/,
                                                message: t("errors.patternPassword")
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