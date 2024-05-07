import React, { useEffect } from 'react';
import '../css/admin.css';
import NavMenu from './navMenuBeneficiary';
import view from '../assets/voir_all.png';

function Dashboardb() {

  return (
    <>
      <NavMenu />
      <section className="content">
        <section className="tables">
          <div className="main_table">
            <div>
              <h3 className="title_dashboard">Dernières notifications</h3>
            </div>
          </div>
          <div className="main_table">
            <div className="table-header">
              
                
            </div>
          </div>
        </section>
        <div className="table_avenir">
          <h3 className="title_dashboard">À venir</h3>
          <p id="date"></p>
        </div>
      </section>
    </>
  );
}

export default Dashboardb;
