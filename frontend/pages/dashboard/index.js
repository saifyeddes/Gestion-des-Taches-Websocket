import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Si l'utilisateur n'a pas de token, rediriger vers la page de connexion
      router.push("/login");
    } else {
      // Décoder le token (ou récupérer des données utilisateur depuis l'API)
      // Pour cet exemple, on suppose que tu as une fonction de décodage de token
      // et que tu vérifies les informations utilisateur.
      const userData = decodeToken(token); // Remplace par une fonction réelle
      setUser(userData);
    }
  }, [router]);

  const decodeToken = (token) => {
    // Exemple simple de décodage du JWT
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload; // Retourner les données utilisateur décodées
    } catch (e) {
      return null;
    }
  };

  return (
    <div>
      <h1>Bienvenue, {user ? user.name : "Utilisateur"}</h1>
      {/* Affiche des informations du tableau de bord */}
    </div>
  );
}
