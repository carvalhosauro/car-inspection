import { redirect } from "next/navigation";

// Relatórios foi desativado como página própria — os indicadores agora vivem
// no Dashboard. Mantemos a rota apenas para redirecionar links antigos.
export default function ReportsPage() {
  redirect("/dashboard");
}
