/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import styles from './Pagination.module.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Pagination = ({ totalItems, itemsPerPage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const page = urlParams.get('startIndex');
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [location.search]);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', pageNumber);
    const searchQuery = urlParams.toString();
    navigate(`${location.pathname}?${searchQuery}`);
  };

  const renderPaginationLinks = () => {
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <a
          key={i}
          href="#"
          className={currentPage === i ? styles['active'] : ''}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </a>
      );
    }
    return paginationLinks;
  };

  return (
    <div>
      <section id={styles['pagination']} className="section-p1">
        <button type='button' onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}><FaArrowLeft /></button>
        {currentPage>1 && <button type='button' onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}> {currentPage-1} </button>}
        <button type='button' onClick={() => handlePageClick(currentPage - 1)} className={styles["selected"]} > {currentPage} </button>
        { currentPage<totalPages && <button type='button' onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>{currentPage+1}</button>}
        <button type='button' onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}><FaArrowRight /></button>

        {/*
          if currentPage+1 <totalPages show .... then the totalpages number then show the last button and the 1st button in the beginning 
         */}


      </section>
    </div>
  );
};

export default Pagination;
