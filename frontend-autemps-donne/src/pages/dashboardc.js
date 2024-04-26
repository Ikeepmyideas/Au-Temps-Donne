import React, { useEffect } from 'react';
import '../css/Dashboardc.css';

function Dashboardc() {
  useEffect(() => {
    const navItems = document.querySelectorAll(".nav-item");

    const handleClick = (event) => {
      navItems.forEach((item) => {
        item.classList.remove("active");
      });
      event.currentTarget.classList.add("active");
    };

    navItems.forEach((navItem) => {
      navItem.addEventListener("click", handleClick);
    });

    return () => {
      navItems.forEach((navItem) => {
        navItem.removeEventListener("click", handleClick);
      });
    };
  }, []);
  return (
    <body className='bodyletsgo' class="dashboardcbody">
      <main>
        <nav className="main-menu">
          <h1>Fitness App</h1>
          <img className="logo" src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/4cfdcb5a-0137-4457-8be1-6e7bd1f29ebb" alt="" />
          <ul>
            <li className="nav-item active">
              <b></b>
              <b></b>
              <a href="#">
                <i className="fa fa-house nav-icon"></i>
                <span className="nav-text">Home</span>
              </a>
            </li>

            <li className="nav-item">
              <b></b>
              <b></b>
              <a href="#">
                <i className="fa fa-user nav-icon"></i>
                <span className="nav-text">Profile</span>
              </a>
            </li>

            <li className="nav-item">
              <b></b>
              <b></b>
              <a href="#">
                <i className="fa fa-calendar-check nav-icon"></i>
                <span className="nav-text">Schedule</span>
              </a>
            </li>

            <li className="nav-item">
              <b></b>
              <b></b>
              <a href="#">
                <i className="fa fa-person-running nav-icon"></i>
                <span className="nav-text">Activities</span>
              </a>
            </li>

            <li className="nav-item">
              <b></b>
              <b></b>
              <a href="#">
                <i className="fa fa-sliders nav-icon"></i>
                <span className="nav-text">Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <section className="content">
          <div className="left-content">
            <div className="activities">
              <h1>Popular Activities</h1>
              <div className="activity-container">
                <div className="image-container img-one">
                  <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/467cf682-03fb-4fae-b129-5d4f5db304dd" alt="tennis" />
                  <div className="overlay">
                    <h3>Tennis</h3>
                  </div>
                </div>

                <div className="image-container img-two">
                  <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/3bab6a71-c842-4a50-9fed-b4ce650cb478" alt="hiking" />
                  <div className="overlay">
                    <h3>Hiking</h3>
                  </div>
                </div>

                <div className="image-container img-three">
                  <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c8e88356-8df5-4ac5-9e1f-5b9e99685021" alt="running" />
                  <div className="overlay">
                    <h3>Running</h3>
                  </div>
                </div>

                <div className="image-container img-four">
                  <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/69437d08-f203-4905-8cf5-05411cc28c19" alt="cycling" />
                  <div className="overlay">
                    <h3>Cycling</h3>
                  </div>
                </div>

                <div className="image-container img-five">
                  <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/e1a66078-1927-4828-b793-15c403d06411" alt="yoga" />
                  <div className="overlay">
                    <h3>Yoga</h3>
                  </div>
                </div>

                <div className="image-container img-six">
                  <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/7568e0ff-edb5-43dd-bff5-aed405fc32d9" alt="swimming" />
                  <div className="overlay">
                    <h3>Swimming</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="left-bottom">
              <div className="weekly-schedule">
                <h1>Weekly Schedule</h1>
                <div className="days">
                  <div className="day">Mon</div>
                  <div className="day">Tue</div>
                  <div className="day">Wed</div>
                  <div className="day">Thu</div>
                  <div className="day">Fri</div>
                  <div className="day">Sat</div>
                  <div className="day">Sun</div>
                </div>
              </div>

              <div className="stats">
                <h1>Weekly Stats</h1>
                <div className="stats-container">
                  <div className="stat">
                    <h2>Running</h2>
                    <span>6 hours</span>
                  </div>
                  <div className="stat">
                    <h2>Hiking</h2>
                    <span>5 hours</span>
                  </div>
                  <div className="stat">
                    <h2>Swimming</h2>
                    <span>4 hours</span>
                  </div>
                  <div className="stat">
                    <h2>Tennis</h2>
                    <span>3 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-content">
            <div className="profile">
              <h1>My Profile</h1>
              <div className="profile-details">
                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/4cfdcb5a-0137-4457-8be1-6e7bd1f29ebb" alt="" />
                <div className="details">
                  <h2>Jane Doe</h2>
                  <p>Age: 30</p>
                  <p>Weight: 60 kg</p>
                  <p>Height: 170 cm</p>
                </div>
              </div>
            </div>

            <div className="achievements">
              <h1>Achievements</h1>
              <div className="achievement-container">
                <div className="achievement">
                  <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/bf686184-8358-44a6-b157-2a676376c016" alt="" />
                  <p>10 km Running</p>
                </div>
                <div className="achievement">
                  <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/8dc6e313-08d0-45a1-b7e9-8a70c3034b1b" alt="" />
                  <p>20 km Cycling</p>
                </div>
                <div className="achievement">
                  <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/2d725b27-216f-4037-a4d8-0979f0e73c2b" alt="" />
                  <p>50 km Hiking</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </body>
  );
}

export default Dashboardc;

