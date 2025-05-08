import { FormProvider } from "@/context/FormContext";
import Dashboard from "./dashboard/Dashboard";

export default function Home() {
  return (
    <div>
      <FormProvider>
        <Dashboard />
      </FormProvider>
    </div>
  );
}
