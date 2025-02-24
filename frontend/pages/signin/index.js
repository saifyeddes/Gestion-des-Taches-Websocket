import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router"; // Pour la redirection après connexion

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur si l'authentification échoue
  const router = useRouter(); // Pour la redirection après connexion

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Si la réponse est OK, redirige l'utilisateur vers la page d'accueil ou tableau de bord
        localStorage.setItem("token", data.token); // Sauvegarde du token dans le localStorage
        router.push("/dashboard"); // Redirection vers une page protégée (ex: tableau de bord)
      } else {
        // Si l'authentification échoue
        setErrorMessage(data.message); // Afficher le message d'erreur
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      setErrorMessage("Erreur serveur, veuillez réessayer plus tard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-700">
          Connexion
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>

        {/* Afficher les erreurs si l'authentification échoue */}
        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-600">{errorMessage}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Vous n'avez pas de compte ?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
