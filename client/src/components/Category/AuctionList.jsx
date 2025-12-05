import Sidebar from "./Sidebar"
import AuctionCard from "./AuctionCard"
import { useState, useEffect } from 'react'
import { useAuctionStore } from "../../stores/useAuction.store";

const categoriesData = [
  {
    name: 'Arts',
    subcategories: ['Paintings', 'Sculptures', 'Prints'],
  },
  {
    name: 'Automotive',
    subcategories: ['Antiques', 'Auto Parts', 'Second Hands'],
    isOpen: true,
  },
  {
    name: 'Electronics',
    subcategories: ['Computers', 'Phones', 'Cameras'],
  },
  {
    name: 'Fashion',
    subcategories: ['Men', 'Women', 'Accessories'],
  },
  {
    name: 'Game',
    subcategories: ['Consoles', 'PC', 'Mobile'],
  },
];

const productsData = [
  {
    id: 1,
    title: 'Fuji GS645 Professional Wide 60 + 4/60mm wide abcxyz...',
    image: 'https://placehold.co/400x300/png?text=Camera+1',
    currentBid: '10.350.000.000 VND',
    highestBidder: '****Dreckiez',
    posted: '10 mins ago',
    bids: '3.000.000',
    endTime: '1d 12h 30m',
    isNew: false,
  },
  {
    id: 2,
    title: 'Fuji GS645 Professional Wide 60 + 4/60mm wide abcxyz...',
    image: 'https://placehold.co/400x300/png?text=Camera+2',
    currentBid: '10.350.000.000 VND',
    highestBidder: '****Dreckiez',
    posted: '10 mins ago',
    bids: '3.000.000',
    endTime: '1d 12h 30m',
    isNew: false,
  },
  {
    id: 3,
    title: 'Fuji GS645 Professional Wide 60 + 4/60mm wide abcxyz...',
    image: 'https://placehold.co/400x300/png?text=Camera+3',
    currentBid: '10.350.000.000 VND',
    highestBidder: '****Dreckiez',
    posted: '10 mins ago',
    bids: '3.000.000',
    endTime: '1d 12h 30m',
    isNew: true,
  },
  {
    id: 4,
    title: 'Fuji GS645 Professional Wide 60 + 4/60mm wide abcxyz...',
    image: 'https://placehold.co/400x300/png?text=Camera+4',
    currentBid: '10.350.000.000 VND',
    highestBidder: '****Dreckiez',
    posted: '10 mins ago',
    bids: '3.000.000',
    endTime: '1d 12h 30m',
    isNew: false,
  },
  {
    id: 5,
    title: 'Fuji GS645 Professional Wide 60 + 4/60mm wide abcxyz...',
    image: 'https://placehold.co/400x300/png?text=Camera+5',
    currentBid: '10.350.000.000 VND',
    highestBidder: '****Dreckiez',
    posted: '10 mins ago',
    bids: '3.000.000',
    endTime: '1d 12h 30m',
    isNew: true,
  },
  {
    id: 6,
    title: 'Fuji GS645 Professional Wide 60 + 4/60mm wide abcxyz...',
    image: 'https://placehold.co/400x300/png?text=Camera+6',
    currentBid: '10.350.000.000 VND',
    highestBidder: '****Dreckiez',
    posted: '10 mins ago',
    bids: '3.000.000',
    endTime: '1d 12h 30m',
    isNew: false,
  },
  {
    id: 7,
    title: 'Fuji GS645 Professional Wide 60 + 4/60mm wide abcxyz...',
    image: 'https://placehold.co/400x300/png?text=Camera+7',
    currentBid: '10.350.000.000 VND',
    highestBidder: '****Dreckiez',
    posted: '10 mins ago',
    bids: '3.000.000',
    endTime: '1d 12h 30m',
    isNew: false,
  },
  {
    id: 8,
    title: 'Fuji GS645 Professional Wide 60 + 4/60mm wide abcxyz...',
    image: 'https://placehold.co/400x300/png?text=Camera+8',
    currentBid: '10.350.000.000 VND',
    highestBidder: '****Dreckiez',
    posted: '10 mins ago',
    bids: '3.000.000',
    endTime: '1d 12h 30m',
    isNew: false,
  },
  {
    id: 9,
    title: 'Fuji GS645 Professional Wide 60 + 4/60mm wide abcxyz...',
    image: 'https://placehold.co/400x300/png?text=Camera+9',
    currentBid: '10.350.000.000 VND',
    highestBidder: '****Dreckiez',
    posted: '10 mins ago',
    bids: '3.000.000',
    endTime: '1d 12h 30m',
    isNew: false,
  },
];

const AuctionList = () => {
  const {
    auctions,
    pagination,
    loading, 
    getAuctions, 
    nextPage, 
    prevPage
  } = useAuctionStore();

  useEffect(() => {
    getAuctions(1);
  }, [])

  return (
    <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4 bg-[#22222a] p-5 rounded-lg h-fit">
          {categoriesData.map((category, index) => (
            <Sidebar key={index} category={category} />
          ))}
        </aside>

        {/* Product Grid Area */}
        <section className="lg:w-3/4">
          <div className="flex justify-end mb-4">
            <div className="relative">
              <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded inline-flex items-center hover:bg-gray-50 focus:outline-none">
                <span className="mr-1">Sort By</span>
                {/* <ChevronDown size={16} /> */}
              </button>
              {/* Dropdown menu can be added here */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            <button className="w-8 h-8 flex items-center justify-center bg-[#22222a] text-white rounded hover:bg-gray-800">1</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-100">2</button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-100">10</button>
          </div>
        </section>
      </main>
  )
}

export default AuctionList