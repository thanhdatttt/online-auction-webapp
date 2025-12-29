import { useAuctionStore } from "../../stores/useAuction.store.js";
import { useEffect } from "react";
import Loading from "../Loading.jsx";
import Hero from "./Hero.jsx";
import CategoryBrowse from "./CategoryBrowse.jsx";
import PopularRecommend from "./PopularRecommend.jsx";
import HighPrice from "./HighPrice.jsx";
import EndingSoon from "./EndingSoon.jsx";
import Proposition from "./Proposition.jsx";
import About from "./About.jsx";
import Footer from "../Footer.jsx";

const HomeLayout = () => {
  const {
    getHomeAuctions,
    loadingHome,
    heroAuction,
    homeEndingSoon,
    homeHighestPrice,
  } = useAuctionStore();

  useEffect(() => {
    getHomeAuctions();
  }, []);

  if (loadingHome) return(
    <Loading/>
  );

  return (
    <>
      {heroAuction && <Hero auction={heroAuction}/>}
      <About/>
      <CategoryBrowse/>
      <PopularRecommend/>
      {homeHighestPrice && <HighPrice auctions={homeHighestPrice}/>}
      {homeEndingSoon && <EndingSoon auctions={homeEndingSoon}/>}
      <Proposition/>
      <Footer />
    </>
  );
}

export default HomeLayout;