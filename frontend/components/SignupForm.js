import { useState } from "react";
import axios from "../utils/api";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      setMessage(res.data.msg); // Message de succès ou d'erreur
    } catch (error) {
      console.error(error); // Afficher l'erreur pour plus de détails
      setMessage(error.response?.data?.msg || "Erreur lors de l'inscription");
    }
  };
  

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
