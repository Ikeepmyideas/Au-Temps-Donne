import React, { useEffect, useState } from 'react';
import '../css/homepageb.css';
import { Link } from 'react-router-dom';
import NavMenu from './navMenuVolunteer';

function Dashboardv() {
  const [profileImagePath, setProfileImagePath] = useState('');
  const [articles, setArticles] = useState([]);
  const [userInfo, setUserInfo] = useState(null); 

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('http://localhost:8000/api/volunteer/userinfo', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          setUserInfo(userData.volunteer); 
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    fetchUserData();
  }, []);



  return (
    <>
      <NavMenu />
      
      <div className="user-info">
        {userInfo && (
          <div>
            <h2>User Information</h2>
            <p>Name: {userInfo.nom} {userInfo.prenom}</p>
            <p>Email: {userInfo.email}</p>
            {/* Afficher d'autres informations utilisateur si nécessaire */}
          </div>
        )}
      </div>

      <h1 id="derniersarticles">Derniers articles sur nos actions</h1>

      <section className="blocblog">
        <div className="carousel" id="carousel">
          {articles.map((article, index) => (
            <div className="article" key={index}>
              <br/>
              <img src={`${article.image}`} className="photoArticle" alt={`Article ${index}`} />
              <p className="title">{article.titre}</p>
              <center><p className="discover">Voir plus</p></center>
            </div>
          ))}
        </div>
        <button className="prev">&#10094;</button>
        <button className="next">&#10095;</button>
      </section>
    </>
  );
}

export default Dashboardv;
