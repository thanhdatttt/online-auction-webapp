import AuctionList from "../components/AuctionList/AuctionList.jsx"
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx"

const AuctionPage = () => {
  return (
        <div className="flex flex-col">
            <Header />
            <AuctionList />
            <Footer/>
        </div>
    );
}

export default AuctionPage;