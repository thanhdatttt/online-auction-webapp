import AuctionList from "../components/AuctionList/AuctionList"
import Header from "../components/Header"

const AuctionPage = () => {
  return (
        <div className="flex">
            <Header />
            <AuctionList />
        </div>
    )
}

export default AuctionPage