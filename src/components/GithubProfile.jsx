// src/components/GithubProfile.jsx
import React from 'react';

function GithubProfile({ userData }) {
  if (!userData) return <div className="placeholder">Buscando perfil de GitHub...</div>;

  return (
    <div className="card github-card">
      <h2>Perfil Profesional</h2>
      <img src={userData.avatar_url} alt="Avatar" width="100" style={{ borderRadius: '50%' }} />
      <h3>{userData.name || userData.login}</h3>
      <p>{userData.bio || "Sin biografía disponible"}</p>
      <ul>
        <li>Repositorios públicos: {userData.public_repos}</li>
        <li>Seguidores: {userData.followers}</li>
      </ul>
      <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
        Ver perfil en GitHub
      </a>
    </div>
  );
}

export default GithubProfile;