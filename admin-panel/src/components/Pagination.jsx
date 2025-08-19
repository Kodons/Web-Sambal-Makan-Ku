import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className="pagination is-centered mt-5" role="navigation" aria-label="pagination">
            <ul className="pagination-list">
                {pageNumbers.map(number => (
                    <li key={number}>
                        <a 
                            className={`pagination-link ${currentPage === number ? 'is-current has-background-primary has-text-white' : ''}`}
                            onClick={() => onPageChange(number)}
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;