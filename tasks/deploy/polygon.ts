import { task } from "hardhat/config";

import polygonConfig from "./constants/polygonConfig";
import testPolygonConfig from "./constants/testPolygonConfig";
import { writeFileSync } from "fs";

task("deploy:polygon", "Deploys Polygon contracts").setAction(async function (
  taskArguments,
  { ethers }
) {
  const mainnet = false;

  const POLYGON_CONFIG = mainnet ? polygonConfig : testPolygonConfig;
  const network = mainnet ? "polygon" : "mumbai";

  const signer = (await ethers.getSigners())[0];

  console.log(`start to deploy to ${network}; signer is: ${signer.address}`);
  console.log(`teamEOA: ${POLYGON_CONFIG.teamEOA}; teamMultiSig: ${POLYGON_CONFIG.teamMultisig}`);
  // return;
  // Load
  const [
    Wine,
    GaugeFactory,
    BribeFactory,
    PairFactory,
    Router,
    Library,
    VeArtProxy,
    VotingEscrow,
    Voter,
    Minter,
    WineGovernor,
    MerkleClaim,
  ] = await Promise.all([
    ethers.getContractFactory("Wine"),
    ethers.getContractFactory("GaugeFactory"),
    ethers.getContractFactory("BribeFactory"),
    ethers.getContractFactory("PairFactory"),
    ethers.getContractFactory("Router"),
    ethers.getContractFactory("DionysusLibrary"),
    ethers.getContractFactory("VeArtProxy"),
    ethers.getContractFactory("VotingEscrow"),
    ethers.getContractFactory("Voter"),
    ethers.getContractFactory("Minter"),
    ethers.getContractFactory("WineGovernor"),
    ethers.getContractFactory("MerkleClaim"),
  ]);

  let deployed = Object();

  /*
  const wine_address = "";
  const wine = await ethers.getContractAt("Wine", wine_address); /*/
  const wine = await Wine.deploy();
  await wine.deployed();
  //*/
  console.log("Wine deployed to: ", wine.address);
  deployed.wine = wine.address;

  /*
  const gaugeFactory_address = "";
  const gaugeFactory = await ethers.getContractAt("GaugeFactory", gaugeFactory_address);/*/
  const gaugeFactory = await GaugeFactory.deploy();
  await gaugeFactory.deployed();
  //*/
  console.log("GaugeFactory deployed to: ", gaugeFactory.address);
  deployed.gaugeFactory = gaugeFactory.address;

  /*
  const bribeFactory_address = "";
  const bribeFactory = await ethers.getContractAt("BribeFactory", bribeFactory_address);/*/
  const bribeFactory = await BribeFactory.deploy();
  await bribeFactory.deployed();
  //*/
  console.log("BribeFactory deployed to: ", bribeFactory.address);
  deployed.bribeFactory = bribeFactory.address;

  /*
  const pairFactory_address = "";
  const pairFactory = await ethers.getContractAt("PairFactory", pairFactory_address);/*/
  const pairFactory = await PairFactory.deploy();
  await pairFactory.deployed();
  //*/
  console.log("PairFactory deployed to: ", pairFactory.address);
  deployed.pairFactory = pairFactory.address;

  /*
  const router_address = "";
  const router = await ethers.getContractAt("Router", router_address);/*/
  const router = await Router.deploy(pairFactory.address, POLYGON_CONFIG.WETH);
  await router.deployed();
  //*/
  console.log("Router deployed to: ", router.address);
  console.log("Args: ", pairFactory.address, POLYGON_CONFIG.WETH, "\n");
  deployed.router = router.address;
  deployed.routerArgs = {
    factory: pairFactory.address,
    weth: POLYGON_CONFIG.WETH
  };

  /*
  const library_address = "";
  const library = await ethers.getContractAt("DionysusLibrary", library_address);/*/
  const library = await Library.deploy(router.address);
  await library.deployed();
  //*/
  console.log("DionysusLibrary deployed to: ", library.address);
  console.log("Args: ", router.address, "\n");
  deployed.library = library.address;
  deployed.libraryArgs = {
    router: router.address
  };

  /*
  const artProxy_address = "";
  const artProxy = await ethers.getContractAt("VeArtProxy", artProxy_address);/*/
  const artProxy = await VeArtProxy.deploy();
  await artProxy.deployed();
  //*/
  console.log("VeArtProxy deployed to: ", artProxy.address);
  deployed.artProxy = artProxy.address;

  /*
  const escrow_address = "";
  const escrow = await ethers.getContractAt("VotingEscrow", escrow_address);/*/
  const escrow = await VotingEscrow.deploy(wine.address, artProxy.address);
  await escrow.deployed();
  //*/
  console.log("VotingEscrow deployed to: ", escrow.address);
  console.log("Args: ", wine.address, artProxy.address, "\n");
  deployed.escrow = escrow.address;
  deployed.escrowArgs = {
    wine: wine.address,
    artProxy: artProxy.address
  };

  /*
  const voter_address = "";
  const voter = await ethers.getContractAt("Voter", voter_address);/*/
  const voter = await Voter.deploy(
    escrow.address,
    pairFactory.address,
    gaugeFactory.address,
    bribeFactory.address
  );
  await voter.deployed();
  //*/
  console.log("Voter deployed to: ", voter.address);
  console.log("Args: ", 
    escrow.address,
    pairFactory.address,
    gaugeFactory.address,
    bribeFactory.address,
    "\n"
  );
  deployed.voter = voter.address;
  deployed.voterAddress = {
    escrow: escrow.address,
    pairFactory: pairFactory.address,
    gaugeFactory: gaugeFactory.address,
    bribeFactory: bribeFactory.address,
  };

  /*
  const minter_address = "";
  const minter = await ethers.getContractAt("Minter", minter_address);/*/
  const minter = await Minter.deploy(
    voter.address,
    escrow.address
  );
  await minter.deployed();
  //*/
  console.log("Minter deployed to: ", minter.address);
  console.log("Args: ", 
    voter.address,
    escrow.address,
    "\n"
  );
  deployed.minter = minter.address;
  deployed.minterArgs = {
    voter: voter.address,
    escrow: escrow.address
  };

  /*
  const governor_address = "";
  const governor = await ethers.getContractAt("WineGovernor", governor_address);/*/
  const governor = await WineGovernor.deploy(escrow.address);
  await governor.deployed();
  //*/
  console.log("WineGovernor deployed to: ", governor.address);
  console.log("Args: ", escrow.address, "\n");
  deployed.governor = governor.address;
  deployed.governorArgs = {
    escrow: escrow.address
  };

  // Airdrop
  /*
  const claim = await MerkleClaim.deploy(wine.address, POLYGON_CONFIG.merkleRoot);
  await claim.deployed();
  console.log("MerkleClaim deployed to: ", claim.address);
  console.log("Args: ", wine.address, POLYGON_CONFIG.merkleRoot, "\n");
  */

  // Initialize
  await wine.initialMint(POLYGON_CONFIG.teamEOA);
  console.log("Initial minted");

  /*
  await wine.setMerkleClaim(claim.address);
  console.log("MerkleClaim set");
  */

  await wine.setMinter(minter.address);
  console.log("Minter set");

  await pairFactory.setPauser(POLYGON_CONFIG.teamMultisig);
  console.log("Pauser set");

  await escrow.setVoter(voter.address);
  console.log("Voter set");

  await escrow.setTeam(POLYGON_CONFIG.teamMultisig);
  console.log("Team set for escrow");

  await voter.setGovernor(POLYGON_CONFIG.teamMultisig);
  console.log("Governor set");

  await voter.setEmergencyCouncil(POLYGON_CONFIG.teamMultisig);
  console.log("Emergency Council set");

  await governor.setTeam(POLYGON_CONFIG.teamMultisig)
  console.log("Team set for governor");

  // Whitelist
  const nativeToken = [wine.address];
  const tokenWhitelist = nativeToken.concat(POLYGON_CONFIG.tokenWhitelist);
  await voter.initialize(tokenWhitelist, minter.address);
  console.log("Whitelist set");

  // Initial veWINE distro
  await minter.initialize(POLYGON_CONFIG.partnerAddrs, POLYGON_CONFIG.partnerAmts, POLYGON_CONFIG.partnerMax);
  console.log("veWINE distributed");

  await minter.setTeam(POLYGON_CONFIG.teamMultisig)
  console.log("Team set for minter");
  
  const data = JSON.stringify(deployed, null, 4);
  writeFileSync(`./deployed/${network}.address.json`, data);

  console.log("Polygon contracts deployed");
});
