import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { Menu, School, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Footer from "./Footer";
import { logout } from "@/services/auth.service";

export default function MainLayout() {
  const [userData, setUserData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("usuario") || "null");
    if (storedUser) {
      setUserData(storedUser);
    } else {
      console.error("No se pudo obtener el perfil de usuario.");
    }
  }, []);

  if (!userData) {
    return <div className="p-6">Cargando perfil de usuario...</div>;
  }

  const logoutSubmit = () => {
    logout();
    navigate("/login");
  };

  const NavItems = () => (
    <div className="flex gap-4">
      {/* Ambos roles ven el mismo botón */}
      <NavLink to="/home">
        <Button variant="ghost" className="text-sm font-medium">
          Ir a inicio
        </Button>
      </NavLink>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-8">
          {/* Logo */}
          <a className="flex items-center space-x-2" href="/home">
            <School className="h-6 w-6 text-green-500" />
            <span className="font-bold">MiLiceo</span>
          </a>

          {/* Botón menú móvil */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavItems />
          </nav>

          {/* Dropdown usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="text-sm font-medium">{userData.rol}</div>
                <div className="text-xs text-muted-foreground">
                  {userData.email}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <NavLink to="/login" onClick={logoutSubmit}>
                  Cerrar sesión
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Menú lateral móvil */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[250px] p-8">
          <nav className="flex flex-col gap-4">
            <NavItems />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Contenido principal */}
      <main className="flex-1">
        <div className="container mx-auto py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
