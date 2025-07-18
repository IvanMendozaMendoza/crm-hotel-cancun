import { redirect } from "next/navigation";

const notFound = () => {
    redirect("/dashboard")
};
export default notFound;
