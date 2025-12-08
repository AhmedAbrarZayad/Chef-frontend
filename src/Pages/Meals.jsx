import React, { useState } from 'react';
import SearchBar from '../Components/SearchBar';
import CardLayout from '../Components/CardLayout';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const Meals = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState(''); // 'asc' or 'desc'
  const axiosSecure = useAxiosSecure();
  // Local state for meals and totalPages
  const [totalPages, setTotalPages] = useState(1);

  // Fetch meals from backend
  const { data, isLoading } = useQuery({
    queryKey: ['meals', page, sortBy, searchTerm, order],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/all-meals?limit=10&page=${page}&sortBy=${sortBy}&search=${searchTerm}&order=${order}`
      );
      console.log(order);
      setTotalPages(res.data.totalPages);
      return res.data;
    },
    keepPreviousData: true,
  });

  // Handle search input
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setPage(1); 
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
    setPage(1);
  }


  return (
    <div>
      <div className="flex justify-center items-center mt-10 w-[80%] mx-auto">
        <SearchBar onChange={handleSearchChange} />
        <div className='flex gap-4 w-[20%] justify-end'>
            <select
            className="select select-bordered border-2 border-black bg-white rounded-4xl"
            onChange={handleSortChange}
            value={sortBy}
            >
            <option value="">Sort by</option>
            <option value="foodName">Name</option>
            <option value="price">Price</option>
            <option value="date">Date</option>
            </select>
            <select
            className="select select-bordered border-2 border-black bg-white rounded-4xl"
            onChange={handleOrderChange}
            value={order}
            >
            <option value="" selected>Order</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
            </select>
        </div>
      </div>

      <div className="mt-10 w-[80%] mx-auto">
        <CardLayout
          meals={data ? data.items : []}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Meals;
