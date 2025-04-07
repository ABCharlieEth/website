"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  PrimaryExternalLink,
  SecondaryExternalLink,
} from "../../features/common/components/Button";
import SABCard from "../../features/ygata/components/SABCard";
import LiquidAssetsCard from "../../features/ygata/components/LiquidAssetsCard";
import NFTValueCard from "../../features/ygata/components/NFTValueCard";
import { fetchTokenPriceV2 } from "@/api/fetchTokenPriceV2";
import { fetchStakedAssets } from "@/api/fetchStakedAssets";
import RowCardLoader from "../../features/ygata/components/RowCardLoader";
import { Liquidity, StakedAssetsBreakdown, YGataNFT } from "@/types";
import liquidityData from "../../features/ygata/data/liquidityData.json";
import nftAssetsData from "../../features/ygata/data/nftAssetsData.json";
import { formatNumber } from "@/actions/formatNumber";
import { formatPrice } from "@/actions/formatPrice";
import ManagedLiquidityCard from "@/features/ygata/components/ManagedLiquidityCard";

const page = () => {
  const initialLiquidity: Liquidity[] = liquidityData;

  const initialNFTVal: YGataNFT[] = nftAssetsData;

  const totalLPValue = 112500;
  const totalNFTValue = 0;

  const [sabData, setSabData] = useState<StakedAssetsBreakdown[] | null>();
  // const [CoingeckoYGata, setCoingeckoYGata] = useState(0);
  const [managedAssets, setManagedAssets] = useState<number>(0);
  const [assetsPrices, setAssetsPrices] = useState<number[]>([]);
  const [stakedAssets, setStakedAssets] = useState<number>(0);
  const [stakedQuantities, setStakedQuantities] = useState<number[]>([]);
  const [stakedQuantity, setStakedQuantity] = useState<number>(0);
  const [liquidityQuantities, setLiquidityQuantities] = useState<number[]>([]);
  // const [liquidityQuantity, setLiquidityQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [yGataPrice, setYGataPrice] = useState("0");

  const price = Number(yGataPrice);
  const lastAPR = 38;
  const circulatingSupply = 14500000;
  const totalSupply = 21000000;
  const communityPool = 5710000;
  const stakedTokens = 12510000;
  const marketCap = circulatingSupply * price;
  const fdv = totalSupply * price;

  const [liquidAssetsPrices, setLiquidAssetsPrices] = useState<number[]>([]);
  const [liquidAssets, setLiquidAssets] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    const fetchBalance = async () => {
      const allSABData = await fetchStakedAssets();
      setSabData(allSABData);
      setLoading(false);
    };

    fetchBalance();
  }, []);

  const handlePriceUpdate = (newPrice: number, index: number) => {
    if (newPrice) {
      setAssetsPrices((prevPrices) => {
        const updatedPrices = [...prevPrices];
        updatedPrices[index] = newPrice;
        return updatedPrices;
      });
    }
  };

  const handleStakedQuantity = (newQuantity: number, index: number) => {
    if (newQuantity) {
      setStakedQuantities((prevQuantity) => {
        const updatedQuantity = [...prevQuantity];
        updatedQuantity[index] = newQuantity;
        return updatedQuantity;
      });
    }
  };

  const handleLiquidityQuantity = (newQuantity: number, index: number) => {
    if (newQuantity) {
      setLiquidityQuantities((prevQuantity) => {
        const updatedQuantity = [...prevQuantity];
        updatedQuantity[index] = newQuantity;
        return updatedQuantity;
      });
    }
  };

  // const handlePriceFormat = (price: number) => {
  //   const formattedPrice = new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(price);
  //   return formattedPrice;
  // };

  const handleLiquidityPriceUpdate = (newPrice: number, index: number) => {
    if (newPrice) {
      setLiquidAssetsPrices((prevPrices) => {
        const updatedPrices = [...prevPrices];
        updatedPrices[index] = newPrice;
        return updatedPrices;
      });
    }
  };

  useEffect(() => {
    const sum = assetsPrices.reduce((acc, curr) => acc + curr, 0);
    setStakedAssets(sum);
  }, [assetsPrices]);

  useEffect(() => {
    const sum = liquidAssetsPrices.reduce((acc, curr) => acc + curr, 0);
    setLiquidAssets(sum);
  }, [liquidAssetsPrices]);

  useEffect(() => {
    const sum = stakedQuantities.reduce((acc, curr) => acc + curr, 0);
    setStakedQuantity(sum);
  }, [stakedQuantities]);

  // useEffect(() => {
  //   const sum = liquidityQuantities.reduce((acc, curr) => acc + curr, 0);
  //   setLiquidityQuantity(sum);
  // }, [liquidityQuantities]);

  useEffect(() => {
    setManagedAssets(
      stakedAssets + liquidAssets + totalLPValue + totalNFTValue
    );
    // setCoingeckoYGata(managedAssets / circulatingSupply);
  }, [stakedAssets]);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchPrices = async () => {
      // setLoading(true);
      const updatedTokens = await fetchTokenPriceV2("YGATA");
      const roundedPrice =
        updatedTokens !== null ? parseFloat(updatedTokens).toFixed(5) : null;
      if (roundedPrice) {
        setYGataPrice(roundedPrice);
      } else {
        setYGataPrice("0");
      }
      // setLoading(false);
    };

    fetchPrices();
  }, []);

  console.log(stakedQuantity);

  return (
    <div className="z-10 flex flex-col w-full items-center">
      <div className="relative flex w-full h-[960px] items-center ">
        <div className="absolute w-full h-full overflow-hidden flex justify-center">
          <Image
            style={{
              minWidth: "1920px",
            }}
            src="/images/headers/ygataBg.jpg"
            width={1920}
            height={960}
            quality={100}
            alt=""
            priority={true}
          />
        </div>
        <div className="w-full mx-8 lg:mx-16 3xl:mx-40 flex flex-col gap-8 z-10">
          <div className="flex flex-col gap-2 lg:w-1/2">
            <h1 className="w-full">GATA YIELD DAO</h1>
            <h5 className="text-gray">Managed Assets</h5>
            <div className="flex gap-2 items-center">
              <div className="relative flex items-center justify-center w-6 h-6 bg-dgray rounded">
                <div className="absolute w-[8px] h-[8px] bg-black bg-opacity-40 rounded-full" />
                <motion.div
                  animate={{
                    background: ["#7B5AFF", "#FF4874", "#7B5AFF"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="w-[16px] h-[16px] rounded-full"
                />
              </div>
              {managedAssets ? (
                <>
                  <h4>{formatNumber(managedAssets)}</h4>
                  <h4 className="text-purple">USD</h4>
                </>
              ) : (
                <h4>-</h4>
              )}
            </div>
            <div className="flex gap-2 items-center cursor-pointer">
              <Image
                width={24}
                height={24}
                alt=""
                src="/images/validators/osmosis.png"
              />
              <motion.h4
                animate={{
                  color: ["#7B5AFF", "#FF4874", "#7B5AFF"],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                {yGataPrice ? `${yGataPrice}/yGATA` : "-"}
              </motion.h4>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{
          bottom: "-64px",
        }}
        animate={{
          bottom: "32px",
        }}
        transition={{
          type: "spring",
          ease: "easeIn",
          duration: 1,
          delay: 1,
        }}
        className="fixed flex flex-wrap justify-center gap-4 z-10 px-4"
      >
        <PrimaryExternalLink href="https://daodao.zone/dao/omniflix19z3h463xmkz66vdq8tcpk986kvecjyqxy4ywtdzu4qqe2vjyz69sy0u32r/home">
          Visit DAO to Stake and Vote
        </PrimaryExternalLink>
        <PrimaryExternalLink href="https://app.osmosis.zone/pool/2300">
          Osmosis Incentivize pool
        </PrimaryExternalLink>
        <SecondaryExternalLink href="">epoch rewards</SecondaryExternalLink>
        <SecondaryExternalLink href="https://docs.gatahub.zone/welcome-to-gitbook/gatahub/ygata">
          docs
        </SecondaryExternalLink>
      </motion.div>

      <div className="w-full flex flex-col gap-20 sm:gap-32 md:gap-48 lg:gap-64">
        {/* content container 1 */}
        <div className="mx-4 sm:mx-8 lg:mx-32 3xl:mx-80 flex flex-col gap-[64px] items-center">
          {/* title section */}

          <div className="w-full flex justify-center gap-16 md:gap-32 flex-wrap">
            {/* sub content */}
            <div className="flex flex-col gap-1 items-center">
              <h3 className="text-[24px] sm:text-[28px] lg:text-[32px] text-green">
                {yGataPrice ? yGataPrice : "-"}
              </h3>
              <p>price</p>
            </div>

            <div className="flex flex-col gap-1 items-center">
              <h3 className="text-[24px] sm:text-[28px] lg:text-[32px] text-red">
                {lastAPR ? lastAPR : "-"}%
              </h3>
              <p>Last APR</p>
            </div>

            <div className="flex flex-col gap-1 items-center">
              <h3 className="text-[24px] sm:text-[28px] lg:text-[32px] text-lpurple">
                {fdv ? formatNumber(fdv) : "-"}
              </h3>
              <p>FDV</p>
            </div>

            <div className="flex flex-col gap-1 items-center">
              <h3 className="text-[24px] sm:text-[28px] lg:text-[32px] text-yellow">
                {marketCap ? formatNumber(marketCap) : "-"}
              </h3>
              <p>Market Cap</p>
            </div>

            <div className="flex flex-col gap-1 items-center">
              <h3 className="text-[24px] sm:text-[28px] lg:text-[32px] text-yellow">
                {circulatingSupply ? formatNumber(circulatingSupply) : "-"}
              </h3>
              <p>Circulating Supply</p>
            </div>

            <div className="flex flex-col gap-1 items-center">
              <h3 className="text-[24px] sm:text-[28px] lg:text-[32px] text-yellow">
                {totalSupply ? formatNumber(totalSupply) : "-"}
              </h3>
              <p>Total Supply</p>
            </div>
          </div>
        </div>

        <div className="relative mx-4 sm:mx-8 lg:mx-32 3xl:mx-80 flex flex-col xl:flex-row gap-8">
          <div className="flex flex-col gap-4 h-full">
            <h2>Staked Asset Breakdown</h2>
            <div className="flex gap-2 items-center">
              <div className="relative flex items-center justify-center w-6 h-6 bg-dgray rounded">
                <div className="absolute w-[8px] h-[8px] bg-black bg-opacity-40 rounded-full" />
                <motion.div
                  animate={{
                    background: ["#7B5AFF", "#FF4874", "#7B5AFF"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="w-[16px] h-[16px] rounded-full"
                />
              </div>
              {stakedAssets ? (
                <>
                  <h4>{formatPrice(stakedAssets)}</h4>
                  <h4 className="text-purple">USD</h4>
                </>
              ) : (
                <h4>-</h4>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 w-full">
            {sabData &&
              sabData.map((sab, i) => {
                return (
                  <>
                    {loading ? (
                      <RowCardLoader />
                    ) : (
                      <SABCard
                        key={i}
                        icon={sab.icon}
                        network={sab.network}
                        quantity={sab.quantity}
                        prices={assetsPrices}
                        setPrice={(newPrice) => handlePriceUpdate(newPrice, i)}
                        setQuantity={(newQuantity) =>
                          handleStakedQuantity(newQuantity, i)
                        }
                        symbol={sab.symbol}
                        addr={sab.addr}
                      />
                    )}
                  </>
                );
              })}
          </div>

          <div className="z-[-1] absolute w-full flex justify-center items-center">
            <div className="absolute w-[100vw] h-[637px] top-[-104px] overflow-hidden">
              <Image
                style={{
                  minWidth: "1920px",
                }}
                src="/images/bgs/ygata/ygataBg2.jpg"
                width={1920}
                height={637}
                quality={100}
                alt=""
                priority={true}
              />
            </div>
          </div>
        </div>

        {/* Token Distribution  */}
        <div
          ref={ref}
          className="mx-4 sm:mx-8 lg:mx-32 3xl:mx-80 flex flex-col md:flex-row gap-[40px] items-center"
        >
          <div className="w-full flex flex-col gap-6">
            <h3 className="text-[24px] sm:text-[28px] lg:text-[32px]">
              Token Distribution
            </h3>
            <div className="relative flex items-center justify-between p-6 rounded-xl bg-dgray overflow-hidden">
              <p className="z-[1] text-white">Circulating Supply</p>
              <p className="z-[1] text-white">
                {formatNumber(circulatingSupply)}
              </p>
              <motion.div
                animate={{
                  width: inView
                    ? `${(circulatingSupply / totalSupply) * 100}%`
                    : "0%",
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 2,
                }}
                className="absolute left-0 bg-red h-full"
              ></motion.div>
            </div>

            <div className="relative flex items-center justify-between p-6 rounded-xl bg-dgray overflow-hidden">
              <p className="z-[1] text-white">Staked</p>
              <p className="z-[1] text-white">{formatNumber(stakedTokens)}</p>
              <motion.div
                animate={{
                  width: inView
                    ? `${(stakedTokens / totalSupply) * 100}%`
                    : "0%",
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 2,
                }}
                className="absolute left-0 bg-red h-full"
              ></motion.div>
            </div>

            <div className="relative flex items-center justify-between p-6 rounded-xl bg-dgray overflow-hidden">
              <p className="z-[1] text-white">DAO/CP</p>
              <p className="z-[1] text-white">{formatNumber(communityPool)}</p>
              <motion.div
                animate={{
                  width: inView
                    ? `${(communityPool / totalSupply) * 100}%`
                    : "0%",
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 2,
                }}
                className="absolute left-0 bg-red h-full"
              ></motion.div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-6">
            <h3 className="text-[24px] sm:text-[28px] lg:text-[32px]">
              Asset Allocation
            </h3>
            <div className="relative flex items-center justify-between p-6 rounded-xl bg-dgray overflow-hidden">
              <p className="z-[1] text-white">Staked Assets</p>
              <p className="z-[1] text-white">
                {formatNumber(stakedAssets)}{" "}
                <span className="text-purple font-bold"> USD</span>
              </p>
              <motion.div
                animate={{
                  width: inView
                    ? `${(stakedAssets / managedAssets) * 100}%`
                    : "0%",
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 2,
                }}
                className="absolute left-0 bg-purple h-full"
              ></motion.div>
            </div>

            <div className="relative flex items-center justify-between p-6 rounded-xl bg-dgray overflow-hidden">
              <p className="z-[1] text-white">Liquid Assets</p>
              <p className="z-[1] text-white">
                {formatNumber(liquidAssets)}
                <span className="text-purple font-bold"> USD</span>
              </p>
              <motion.div
                animate={{
                  width: inView
                    ? `${(liquidAssets / managedAssets) * 100}%`
                    : "0%",
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 2,
                }}
                className="absolute left-0 bg-purple h-full"
              ></motion.div>
            </div>

            <div className="relative flex items-center justify-between p-6 rounded-xl bg-dgray overflow-hidden">
              <p className="z-[1] text-white">LP</p>
              <p className="z-[1] text-white">
                {formatNumber(totalLPValue)}
                <span className="text-purple font-bold"> USD</span>
              </p>

              <motion.div
                animate={{
                  width: inView
                    ? `${(totalLPValue / managedAssets) * 100}%`
                    : "0%",
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 2,
                }}
                className="absolute left-0 bg-purple h-full"
              ></motion.div>
            </div>
          </div>
        </div>

        <div className="mx-4 sm:mx-8 lg:mx-32 3xl:mx-80 flex flex-col lg:flex-row gap-[32px] 2xl:gap-[64px]">
          <div className="flex w-full flex-col gap-4">
            <h3 className="text-[24px] sm:text-[28px] lg:text-[32px]">
              Liquid Assets
            </h3>
            <div className="flex gap-2 items-center">
              <div className="relative flex items-center justify-center w-6 h-6 bg-dgray rounded">
                <div className="absolute w-[8px] h-[8px] bg-black bg-opacity-40 rounded-full" />
                <motion.div
                  animate={{
                    background: ["#7B5AFF", "#FF4874", "#7B5AFF"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="w-[16px] h-[16px] rounded-full"
                />
              </div>
              {liquidAssets ? (
                <>
                  <h4>{formatPrice(liquidAssets)}</h4>
                  <h4 className="text-purple">USD</h4>
                </>
              ) : (
                <h4>-</h4>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              {initialLiquidity.map((liquidity, i) => {
                return (
                  <LiquidAssetsCard
                    key={i}
                    icon={liquidity.icon}
                    network={liquidity.network}
                    quantity={liquidity.quantity}
                    symbol={liquidity.symbol}
                    prices={liquidAssetsPrices}
                    setPrice={(newPrice) =>
                      handleLiquidityPriceUpdate(newPrice, i)
                    }
                    setQuantity={(newQuantity) =>
                      handleLiquidityQuantity(newQuantity, i)
                    }
                  />
                );
              })}
            </div>
          </div>

          <div className="w-full flex flex-col p-6 gap-6 rounded-2xl bg-dgray border-[1px] border-white border-opacity-10">
            <h3 className="text-[24px] sm:text-[28px] lg:text-[32px]">
              NFT Value
            </h3>
            <div className="w-full h-[2px] rounded bg-lgray" />

            <div className="w-full h-full overflow-y-scroll overflow-x-hidden flex flex-col gap-2">
              {initialNFTVal.map((nftVal, i) => {
                return (
                  <NFTValueCard
                    key={i}
                    icon={nftVal.icon}
                    network={nftVal.network}
                    quantity={nftVal.quantity}
                    usdValue={nftVal.usdValue}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-4 sm:mx-8 lg:mx-32 3xl:mx-80 flex gap-[64px] items-center">
          <ManagedLiquidityCard totalLPValue={totalLPValue} />
        </div>
      </div>
    </div>
  );
};

export default page;
