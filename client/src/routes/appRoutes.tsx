import { Route, Routes } from "react-router";
import Index from "../pages/index";
import SocialNetworks from "@/pages/socialNetworks";
import Login from "@/pages/admin/login";
import BlogAdmin from "@/pages/admin/blog";
import EventsAdmin from "@/pages/admin/events";
import GlossaryAdmin from "@/pages/admin/glossary";
import Services from "@/pages/services";
import Service from "@/pages/service";
import NotFound from "@/components/notFound/not-found";
import AboutUs from "@/pages/about-us";
import Blog from "@/pages/blog";
import Events from "@/pages/events";
import UsersAdmin from "@/pages/admin/users";
import Glossary from "@/pages/glossary";

export default function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/events" element={<Events />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:service" element={<Service />} />
                <Route path="/contact" element={<SocialNetworks />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/glossary" element={<Glossary />} />


                {/* Admin */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/blog" element={<BlogAdmin />} />
                <Route path="/admin/events" element={<EventsAdmin />} />
                <Route path="/admin/glossary" element={<GlossaryAdmin />} />
                <Route path="/admin/users" element={<UsersAdmin />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}