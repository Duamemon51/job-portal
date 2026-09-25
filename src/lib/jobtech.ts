/**
 * Integration with JobTech Dev's public Jobsearch API (jobsearch.api.jobtechdev.se).
 * The API is read-only and unauthenticated: it covers keyword/location/category
 * search over Arbetsförmedlingen's job ads, but has no concept of accounts,
 * applications, salary data or seniority — those stay client-side or unfiltered.
 */

const JOBTECH_BASE_URL = "https://jobsearch.api.jobtechdev.se";

/** Our category id -> JobTech occupation-field taxonomy concept_id. Categories with
 * no clean 1:1 taxonomy match (kundservice, hr, ovrigt) fall back to a freetext term. */
export const CATEGORY_TO_OCCUPATION_FIELD: Record<string, string> = {
  it: "apaJ_2ja_LuF", // Data/IT
  design: "9puE_nYg_crq", // Kultur, media, design
  admin: "X82t_awd_Qyc", // Administration, ekonomi, juridik
  marknad: "RPTn_bxG_ExZ", // Försäljning, inköp, marknadsföring
  forsaljning: "RPTn_bxG_ExZ", // Försäljning, inköp, marknadsföring
  ekonomi: "X82t_awd_Qyc", // Administration, ekonomi, juridik
  vard: "NYW6_mP6_vwf", // Hälso- och sjukvård
  utbildning: "MVqp_eS8_kDZ", // Pedagogik
  ingenjor: "6Hq3_tKo_V57", // Yrken med teknisk inriktning
};

/** Freetext fallback for categories with no occupation-field match. */
export const CATEGORY_FREETEXT: Record<string, string> = {
  kundservice: "kundservice kundtjänst",
  hr: "HR personal rekrytering",
};

/** Swedish display label for each of our category ids. */
export const CATEGORY_LABELS: Record<string, string> = {
  it: "IT & Tech",
  marknad: "Marknad & Kommunikation",
  design: "Design & UX",
  admin: "Administration",
  kundservice: "Kundservice",
  forsaljning: "Försäljning",
  ekonomi: "Ekonomi & Finans",
  hr: "HR & Personal",
  vard: "Vård & Omsorg",
  utbildning: "Utbildning & Pedagogik",
  ingenjor: "Ingenjör & Teknik",
  ovrigt: "Övrigt",
};

const OCCUPATION_FIELD_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_OCCUPATION_FIELD).map(([category, conceptId]) => [conceptId, category])
);

/** Our city id -> SCB municipality code. "remote" and "hela" are handled separately. */
export const CITY_TO_MUNICIPALITY: Record<string, string> = {
  stockholm: "0180",
  goteborg: "1480",
  malmo: "1280",
};

/** All 290 Swedish municipalities, lowercase label -> JobTech taxonomy concept_id.
 * Lets freeform city names (e.g. from saved job preferences) resolve to a real
 * municipality filter even though only stockholm/goteborg/malmo get a checkbox
 * in the "Ort" filter UI. Static since municipality boundaries rarely change. */
export const MUNICIPALITY_CONCEPT_BY_LABEL: Record<string, string> = {
  "ale": "17Ug_Btv_mBr",
  "alingsås": "UQ75_1eU_jaC",
  "alvesta": "MMph_wmN_esc",
  "aneby": "y9HE_XD7_WaD",
  "arboga": "Jkyb_5MQ_7pB",
  "arjeplog": "vkQW_GB6_MNk",
  "arvidsjaur": "A5WX_XVo_Zt6",
  "arvika": "yGue_F32_wev",
  "askersund": "dbF7_Ecz_CWF",
  "avesta": "Szbq_2fg_ydQ",
  "bengtsfors": "hejM_Jct_XJk",
  "berg": "gRNJ_hVW_Gpg",
  "bjurholm": "vQkf_tw2_CmR",
  "bjuv": "waQp_FjW_qhF",
  "boden": "y4NQ_tnB_eVd",
  "bollebygd": "ypAQ_vTD_KLU",
  "bollnäs": "KxjG_ig5_exF",
  "borgholm": "LY9i_qNL_kXf",
  "borlänge": "cpya_jJg_pGp",
  "borås": "TpRZ_bFL_jhL",
  "botkyrka": "CCVZ_JA7_d3y",
  "boxholm": "e5LB_m9V_TnT",
  "bromölla": "WMNK_PXa_Khm",
  "bräcke": "eNSc_Nj1_CDP",
  "burlöv": "64g5_Lio_aMU",
  "båstad": "i8vK_odq_6ar",
  "dals-ed": "NMc9_oEm_yxy",
  "danderyd": "E4CV_a5E_ucX",
  "degerfors": "pvzC_muj_rcq",
  "dorotea": "tSkf_Tbn_rHk",
  "eda": "N5HQ_hfp_7Rm",
  "ekerö": "magF_Gon_YL2",
  "eksjö": "VacK_WF6_XVg",
  "emmaboda": "1koj_6Bg_8K6",
  "enköping": "HGwg_unG_TsG",
  "eskilstuna": "kMxr_NiX_YrU",
  "eslöv": "gfCw_egj_1M4",
  "essunga": "ZzEA_2Fg_Pt2",
  "fagersta": "7D9G_yrX_AGJ",
  "falkenberg": "qaJg_wMR_C8T",
  "falköping": "ZySF_gif_zE4",
  "falun": "N1wJ_Cuu_7Cs",
  "filipstad": "UXir_vKD_FuW",
  "finspång": "dMFe_J6W_iJv",
  "flen": "P8yp_WT9_Bks",
  "forshaga": "xnEt_JN3_GkA",
  "färgelanda": "kCHb_icw_W5E",
  "gagnef": "Nn7p_W3Z_y68",
  "gislaved": "cNQx_Yqi_83Q",
  "gnesta": "os8Y_RUo_U3u",
  "gnosjö": "91VR_Hxi_GN4",
  "gotland": "Ft9P_E8F_VLJ",
  "grums": "PSNt_P95_x6q",
  "grästorp": "ZNZy_Hh5_gSW",
  "gullspång": "roiB_uVV_4Cj",
  "gällivare": "6R2u_zkb_uoS",
  "gävle": "qk8Y_2b6_82D",
  "göteborg": "PVZL_BQT_XtL",
  "götene": "txzq_PQY_FGi",
  "habo": "9zQB_3vU_BQA",
  "hagfors": "qk9a_g5U_sAH",
  "hallsberg": "Ak9V_rby_yYS",
  "hallstahammar": "oXYf_HmD_ddE",
  "halmstad": "kUQB_KdK_kAh",
  "hammarö": "x5qW_BXr_aut",
  "haninge": "Q7gp_9dT_k2F",
  "haparanda": "tfRE_hXa_eq7",
  "heby": "sD2e_1Tr_4WZ",
  "hedemora": "DE9u_V4K_Z1S",
  "helsingborg": "qj3q_oXH_MGR",
  "herrljunga": "J116_VFs_cg6",
  "hjo": "YbFS_34r_K2v",
  "hofors": "yuNd_3bg_ttc",
  "huddinge": "g1Gc_aXK_EKu",
  "hudiksvall": "Utks_mwF_axY",
  "hultsfred": "AEQD_1RT_vM9",
  "hylte": "3XMe_nGt_RcU",
  "håbo": "Bbs5_JUs_Qh5",
  "hällefors": "sCbY_r36_xhs",
  "härjedalen": "j35Q_VKL_NiM",
  "härnösand": "uYRx_AdM_r4A",
  "härryda": "dzWW_R3G_6Eh",
  "hässleholm": "bP5q_53x_aqJ",
  "höganäs": "8QQ6_e95_a1d",
  "högsby": "WPDh_pMr_RLZ",
  "hörby": "autr_KMa_cfp",
  "höör": "N29z_AqQ_Ppc",
  "jokkmokk": "mp6j_2b6_1bz",
  "järfälla": "qm5H_jsD_fUF",
  "jönköping": "KURg_KJF_Lwc",
  "kalix": "cUyN_C9V_HLU",
  "kalmar": "Pnmg_SgP_uHQ",
  "karlsborg": "e413_94L_hdh",
  "karlshamn": "HtGW_WgR_dpE",
  "karlskoga": "wgJm_upX_z5W",
  "karlskrona": "YSt4_bAa_ccs",
  "karlstad": "hRDj_PoV_sFU",
  "katrineholm": "snx9_qVD_Dr1",
  "kil": "ocMw_Rz5_B1L",
  "kinda": "U4XJ_hYF_FBA",
  "kiruna": "biN6_UiL_Qob",
  "klippan": "JARU_FAY_hTS",
  "knivsta": "KALq_sG6_VrW",
  "kramfors": "yR8g_7Jz_HBZ",
  "kristianstad": "vrvW_sr8_1en",
  "kristinehamn": "SVQS_uwJ_m2B",
  "krokom": "yurW_aLE_4ga",
  "kumla": "viCA_36P_pQp",
  "kungsbacka": "3JKV_KSK_x6z",
  "kungsör": "Fac5_h7a_UoM",
  "kungälv": "ZkZf_HbK_Mcr",
  "kävlinge": "5ohg_WJU_Ktn",
  "köping": "4Taz_AuG_tSm",
  "laholm": "c1iL_rqh_Zja",
  "landskrona": "Yt5s_Vf9_rds",
  "laxå": "oYEQ_m8Q_unY",
  "lekeberg": "yaHU_E7z_YnE",
  "leksand": "7Zsu_ant_gcn",
  "lerum": "yHV7_2Y6_zQx",
  "lessebo": "nXZy_1Jd_D8X",
  "lidingö": "FBbF_mda_TYD",
  "lidköping": "FN1Y_asc_D8y",
  "lilla edet": "YQcE_SNB_Tv3",
  "lindesberg": "JQE9_189_Ska",
  "linköping": "bm2x_1mr_Qhx",
  "ljungby": "GzKo_S48_QCm",
  "ljusdal": "63iQ_V6F_REB",
  "ljusnarsberg": "eF2n_714_hSU",
  "lomma": "naG4_AUS_z2v",
  "ludvika": "Ny2b_2bo_7EL",
  "luleå": "CXbY_gui_14v",
  "lund": "muSY_tsR_vDZ",
  "lycksele": "7rpN_naz_3Uz",
  "lysekil": "z2cX_rjC_zFo",
  "malmö": "oYPt_yRA_Smm",
  "malung-sälen": "FPCd_poj_3tq",
  "malå": "7sHJ_YCE_5Zv",
  "mariestad": "Lzpu_thX_Wpa",
  "mark": "7HAb_9or_eFM",
  "markaryd": "ZhVf_yL5_Q5g",
  "mellerud": "tt1B_7rH_vhG",
  "mjölby": "stqv_JGB_x8A",
  "mora": "UGcC_kYx_fTs",
  "motala": "E1MC_1uG_phm",
  "mullsjö": "smXg_BXp_jTW",
  "munkedal": "96Dh_3sQ_RFb",
  "munkfors": "x73h_7rW_mXN",
  "mölndal": "mc45_ki9_Bv3",
  "mönsterås": "8eEp_iz4_cNN",
  "mörbylånga": "Muim_EAi_EFp",
  "nacka": "aYA7_PpG_BqP",
  "nora": "WFXN_hsU_gmx",
  "norberg": "jbVe_Cps_vtd",
  "nordanstig": "fFeF_RCz_Tm5",
  "nordmaling": "wMab_4Zs_wpM",
  "norrköping": "SYty_Yho_JAF",
  "norrtälje": "btgf_fS7_sKG",
  "norsjö": "XmpG_vPQ_K7T",
  "nybro": "xk68_bJa_6Fh",
  "nykvarn": "mBKv_q3B_SK8",
  "nyköping": "KzvD_ePV_DKQ",
  "nynäshamn": "37UU_T7x_oxG",
  "nässjö": "KfXT_ySA_do2",
  "ockelbo": "GEvW_wKy_A9H",
  "olofström": "1gEC_kvM_TXK",
  "orsa": "CRyF_5Jg_4ht",
  "orust": "tmAp_ykH_N6k",
  "osby": "najS_Lvy_mDD",
  "oskarshamn": "tUP8_hRE_NcF",
  "ovanåker": "JPSe_mUQ_NDs",
  "oxelösund": "72XK_mUU_CAH",
  "pajala": "dHMF_72G_4NM",
  "partille": "CCiR_sXa_BVW",
  "perstorp": "BN7r_iPV_F9p",
  "piteå": "umej_bP2_PpK",
  "ragunda": "Voto_egJ_FZP",
  "robertsfors": "p8Mv_377_bxp",
  "ronneby": "vH8x_gVz_z7R",
  "rättvik": "Jy3D_2ux_dg8",
  "sala": "dAen_yTK_tqz",
  "salem": "4KBw_CPU_VQv",
  "sandviken": "BbdN_xLB_k6s",
  "sigtuna": "8ryy_X54_xJj",
  "simrishamn": "dLxo_EpC_oPe",
  "sjöbo": "P3Cs_1ZP_9XB",
  "skara": "k1SK_gxg_dW4",
  "skellefteå": "kicB_LgH_2Dk",
  "skinnskatteberg": "Nufj_vmt_VrH",
  "skurup": "oezL_78x_r89",
  "skövde": "fqAy_4ji_Lz2",
  "smedjebacken": "5zZX_8FH_Sbq",
  "sollefteå": "v5y4_YPe_TMZ",
  "sollentuna": "Z5Cq_SgB_dsB",
  "solna": "zHxw_uJZ_NJ8",
  "sorsele": "VM7L_yJK_Doo",
  "sotenäs": "aKkp_sEX_cVM",
  "staffanstorp": "vBrj_bov_KEX",
  "stenungsund": "wHrG_FBH_hoD",
  "stockholm": "AvNB_uwa_6n6",
  "storfors": "mPt5_3QD_LTM",
  "storuman": "gQgT_BAk_fMu",
  "strängnäs": "shnD_RiE_RKL",
  "strömstad": "PAxT_FLT_3Kq",
  "strömsund": "ppjq_Eci_Wz9",
  "sundbyberg": "UTJZ_zHH_mJm",
  "sundsvall": "dJbx_FWY_tK6",
  "sunne": "oqNH_cnJ_Tdi",
  "surahammar": "jfD3_Hdg_UhT",
  "svalöv": "2r6J_g2w_qp5",
  "svedala": "n6r4_fjK_kRr",
  "svenljunga": "rZWC_pXf_ySZ",
  "säffle": "wmxQ_Guc_dsy",
  "säter": "c3Zx_jBf_CqF",
  "sävsjö": "L1cX_MjM_y8W",
  "söderhamn": "JauG_nz5_7mu",
  "söderköping": "Pcv9_yYh_Uw8",
  "södertälje": "g6hK_M1o_hiU",
  "sölvesborg": "EVPy_phD_8Vf",
  "tanum": "qffn_qY4_DLk",
  "tibro": "aLFZ_NHw_atB",
  "tidaholm": "Zsf5_vpP_Bs4",
  "tierp": "K8A2_JBa_e6e",
  "timrå": "oJ8D_rq6_kjt",
  "tingsryd": "qz8Q_kDz_N2Y",
  "tjörn": "TbL3_HmF_gnx",
  "tomelilla": "UMev_wGs_9bg",
  "torsby": "hQdb_zn9_Sok",
  "torsås": "wYFb_q7w_Nnh",
  "tranemo": "SEje_LdC_9qN",
  "tranås": "Namm_SpC_RPG",
  "trelleborg": "STvk_dra_M1X",
  "trollhättan": "CSy8_41F_YvX",
  "trosa": "rjzu_nQn_mCK",
  "tyresö": "sTPc_k2B_SqV",
  "täby": "onpA_B5a_zfv",
  "töreboda": "a15F_gAH_pn6",
  "uddevalla": "xQc2_SzA_rHK",
  "ulricehamn": "an4a_8t2_Zpd",
  "umeå": "QiGt_BLu_amP",
  "upplands väsby": "XWKY_c49_5nv",
  "upplands-bro": "w6yq_CGR_Fiv",
  "uppsala": "otaF_bQY_4ZD",
  "uppvidinge": "78cu_S5T_Pgp",
  "vadstena": "VcCU_Y86_eKU",
  "vaggeryd": "zFup_umX_LVv",
  "valdemarsvik": "Sb3D_iGB_aXu",
  "vallentuna": "K4az_Bm6_hRV",
  "vansbro": "4eS9_HX1_M7V",
  "vara": "fbHM_yhA_BqS",
  "varberg": "AkUx_yAq_kGr",
  "vaxholm": "9aAJ_j6L_DST",
  "vellinge": "Tcog_5sH_b46",
  "vetlanda": "xJqx_SLC_415",
  "vilhelmina": "tUnW_mFo_Hvi",
  "vimmerby": "a7hJ_zwv_2FR",
  "vindeln": "izT6_zWu_tta",
  "vingåker": "rut9_f5W_kTX",
  "vårgårda": "NfFx_5jj_ogg",
  "vänersborg": "THif_q6H_MjG",
  "vännäs": "utQc_6xq_Dfm",
  "värmdö": "15nx_Vut_GrH",
  "värnamo": "6bS8_fzf_xpW",
  "västervik": "t7H4_S2P_3Fw",
  "västerås": "8deT_FRF_2SP",
  "växjö": "mmot_H3A_auW",
  "ydre": "vRRz_nLT_vYv",
  "ystad": "hdYk_hnP_uju",
  "åmål": "M1UC_Cnf_r7g",
  "ånge": "swVa_cyS_EMN",
  "åre": "D7ax_CXP_6r1",
  "årjäng": "ymBu_aFc_QJA",
  "åsele": "xLdL_tMA_JJv",
  "åstorp": "tEv6_ktG_QQb",
  "åtvidaberg": "bFWo_FRJ_x2T",
  "älmhult": "EK6X_wZq_CQ8",
  "älvdalen": "cZtt_qGo_oBr",
  "älvkarleby": "cbyw_9aK_Cni",
  "älvsbyn": "14WF_zh1_W3y",
  "ängelholm": "pCuv_P5A_9oh",
  "öckerö": "Zjiv_rhk_oJK",
  "ödeshög": "Fu8g_29u_3xF",
  "örebro": "kuMn_feU_hXx",
  "örkelljunga": "nBTS_Nge_dVH",
  "örnsköldsvik": "zBmE_n6s_MnQ",
  "östersund": "Vt7P_856_WZS",
  "österåker": "8gKt_ZsV_PGj",
  "östhammar": "VE3L_3Ei_XbG",
  "östra göinge": "LTt7_CGG_RUf",
  "överkalix": "n5Sq_xxo_QWL",
  "övertorneå": "ehMP_onv_Chk",
};

/** worktime-extent taxonomy (full/part time). */
const WORKTIME_EXTENT = { heltid: "6YE1_gAC_R2G", deltid: "947z_JGS_Uk2" } as const;

const WORKTIME_EXTENT_TO_EMPLOYMENT: Record<string, string> = Object.fromEntries(
  Object.entries(WORKTIME_EXTENT).map(([id, conceptId]) => [conceptId, id])
);

/** employment-type taxonomy (contract duration). Several of our ids map to the same
 * concept since JobTech doesn't distinguish "projekt" from "visstid", for example. */
const EMPLOYMENT_TYPE: Record<string, string> = {
  projekt: "sTu5_NBQ_udq", // Tidsbegränsad anställning
  visstid: "sTu5_NBQ_udq", // Tidsbegränsad anställning
  vikariat: "gro4_cWF_6D7", // Vikariat
  timanstallning: "1paU_aCR_nGn", // Behovsanställning
  konsult: "sTu5_NBQ_udq", // Tidsbegränsad anställning (closest match)
};

/** Employment ids with no taxonomy match at all — searched as freetext instead. */
const EMPLOYMENT_FREETEXT: Record<string, string> = {
  praktik: "praktik LIA",
};

export type JobtechFilters = {
  q?: string;
  categories?: string[];
  cities?: string[];
  employment?: string[];
  setups?: string[];
  published?: string; // "any" | number of days, as a string
  sort?: string; // "senaste" | "aldst" | "foretag"
  offset?: number;
  limit?: number;
};

/** Builds the query string sent to jobsearch.api.jobtechdev.se/search. */
export function buildJobtechParams(filters: JobtechFilters): URLSearchParams {
  const params = new URLSearchParams();
  const freetextParts: string[] = [];

  if (filters.q?.trim()) freetextParts.push(filters.q.trim());

  const occupationFields = new Set<string>();
  for (const category of filters.categories ?? []) {
    const conceptId = CATEGORY_TO_OCCUPATION_FIELD[category];
    if (conceptId) occupationFields.add(conceptId);
    else if (CATEGORY_FREETEXT[category]) freetextParts.push(CATEGORY_FREETEXT[category]);
  }
  occupationFields.forEach((id) => params.append("occupation-field", id));

  let remote = false;
  const municipalities = new Set<string>();
  for (const city of filters.cities ?? []) {
    if (city === "remote") remote = true;
    else if (city === "hela") continue;
    else if (CITY_TO_MUNICIPALITY[city]) municipalities.add(CITY_TO_MUNICIPALITY[city]);
    else if (MUNICIPALITY_CONCEPT_BY_LABEL[city.toLowerCase()]) municipalities.add(MUNICIPALITY_CONCEPT_BY_LABEL[city.toLowerCase()]);
  }
  municipalities.forEach((code) => params.append("municipality", code));

  const worktimeExtents = new Set<string>();
  const employmentTypes = new Set<string>();
  for (const employment of filters.employment ?? []) {
    if (employment === "heltid" || employment === "deltid") worktimeExtents.add(WORKTIME_EXTENT[employment]);
    else if (EMPLOYMENT_TYPE[employment]) employmentTypes.add(EMPLOYMENT_TYPE[employment]);
    else if (EMPLOYMENT_FREETEXT[employment]) freetextParts.push(EMPLOYMENT_FREETEXT[employment]);
  }
  worktimeExtents.forEach((id) => params.append("worktime-extent", id));
  employmentTypes.forEach((id) => params.append("employment-type", id));

  if ((filters.setups ?? []).includes("remote")) remote = true;
  if (remote) params.set("remote", "true");

  if (filters.published && filters.published !== "any") {
    const days = Number(filters.published);
    if (Number.isFinite(days) && days > 0) params.set("published-after", String(days * 24 * 60));
  }

  if (freetextParts.length) params.set("q", freetextParts.join(" "));

  if (filters.sort === "senaste") params.set("sort", "pubdate-desc");
  else if (filters.sort === "aldst") params.set("sort", "pubdate-asc");
  // "foretag" (company A-Z) has no server-side equivalent; sorted client-side instead.

  params.set("offset", String(filters.offset ?? 0));
  params.set("limit", String(filters.limit ?? 8));

  return params;
}

/* ------------------------------------------------------------------ */
/* Response shapes (partial — only the fields we actually use)         */
/* ------------------------------------------------------------------ */

type JobtechConcept = { concept_id: string | null; label: string | null };

export type JobtechHit = {
  id: string;
  headline: string | null;
  webpage_url: string | null;
  logo_url: string | null;
  description: { text: string | null } | null;
  employer: { name: string | null } | null;
  employment_type: JobtechConcept | null;
  working_hours_type: JobtechConcept | null;
  occupation: JobtechConcept | null;
  occupation_field: JobtechConcept | null;
  application_details: { url: string | null; email: string | null; information: string | null } | null;
  must_have: { skills: { label: string }[] } | null;
  workplace_address: {
    municipality: string | null;
    municipality_code: string | null;
    city: string | null;
    coordinates: [number, number] | null; // [lon, lat]
  } | null;
  publication_date: string | null;
};

type JobtechResponse = {
  total: { value: number };
  hits: JobtechHit[];
};

/* ------------------------------------------------------------------ */
/* Mapping a JobTech hit onto our UI's Job shape                       */
/* ------------------------------------------------------------------ */

export type MappedJob = {
  id: string;
  title: string;
  company: string;
  initials: string;
  brand: { bg: string; fg: string; round: boolean };
  isNew: boolean;
  location: string;
  city: string;
  setups: string[];
  employment: string;
  employmentLabel: string;
  category: string;
  publishedDays: number;
  description: string;
  tags: string[];
  pos: [number, number] | null;
  logoUrl: string | null;
  applyUrl: string;
  webpageUrl: string | null;
  categoryLabel: string;
};

function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 42%)`;
}

function initialsFor(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function mapHitToJob(hit: JobtechHit): MappedJob {
  const company = hit.employer?.name?.trim() || "Okänd arbetsgivare";
  const text = `${hit.headline ?? ""} ${hit.description?.text ?? ""}`.toLowerCase();
  const isRemote = /distans|remote|hemifrån/.test(text);

  const publishedMs = hit.publication_date ? Date.parse(hit.publication_date) : NaN;
  const publishedDays = Number.isFinite(publishedMs)
    ? Math.max(0, Math.floor((Date.now() - publishedMs) / 86_400_000))
    : 0;

  const coords = hit.workplace_address?.coordinates;
  const pos: [number, number] | null = coords ? [coords[1], coords[0]] : null;

  const category = hit.occupation_field?.concept_id
    ? OCCUPATION_FIELD_TO_CATEGORY[hit.occupation_field.concept_id] ?? "ovrigt"
    : "ovrigt";

  const employment = hit.working_hours_type?.concept_id
    ? WORKTIME_EXTENT_TO_EMPLOYMENT[hit.working_hours_type.concept_id] ?? "heltid"
    : "heltid";

  const employmentLabel = [hit.working_hours_type?.label, hit.employment_type?.label]
    .filter(Boolean)
    .join(" · ") || "Se annons";

  const applyUrl =
    hit.application_details?.url ||
    (hit.application_details?.email ? `mailto:${hit.application_details.email}` : null) ||
    hit.webpage_url ||
    "";

  const tags = [hit.occupation?.label, ...(hit.must_have?.skills ?? []).map((s) => s.label)]
    .filter((t): t is string => Boolean(t))
    .slice(0, 6);

  return {
    id: hit.id,
    title: hit.headline?.trim() || "Ledig tjänst",
    company,
    initials: initialsFor(company),
    brand: { bg: hashColor(company), fg: "#ffffff", round: false },
    isNew: publishedDays === 0,
    location: hit.workplace_address?.city || hit.workplace_address?.municipality || "Sverige",
    city: hit.workplace_address?.municipality ?? "",
    setups: isRemote ? ["remote"] : ["plats"],
    employment,
    employmentLabel,
    category,
    publishedDays,
    description: hit.description?.text?.trim().slice(0, 600) ?? "",
    tags,
    pos,
    logoUrl: hit.logo_url,
    applyUrl,
    webpageUrl: hit.webpage_url,
    categoryLabel: CATEGORY_LABELS[category] ?? CATEGORY_LABELS.ovrigt,
  };
}

export type JobtechFacets = {
  categories: Record<string, number>;
  cities: Record<string, number>;
};

async function fetchJobtech(params: URLSearchParams): Promise<JobtechResponse> {
  const res = await fetch(`${JOBTECH_BASE_URL}/search?${params.toString()}`, {
    headers: { accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`JobTech search failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** Category ids that share an occupation-field concept (e.g. marknad/forsaljning)
 * only need one request between them — grouped by concept_id, or by the category id
 * itself for the freetext-only ones (kundservice, hr) that have no shared concept.
 * `isOccupationField` marks the groups that partition the taxonomy (used to compute
 * "ovrigt" as a real remainder, not an overlapping freetext-matched count). */
function categoryFacetGroups(): { representative: string; members: string[]; isOccupationField: boolean }[] {
  const byConcept = new Map<string, string[]>();
  for (const [category, conceptId] of Object.entries(CATEGORY_TO_OCCUPATION_FIELD)) {
    byConcept.set(conceptId, [...(byConcept.get(conceptId) ?? []), category]);
  }
  const groups = Array.from(byConcept.values()).map((members) => ({
    representative: members[0],
    members,
    isOccupationField: true,
  }));
  for (const category of Object.keys(CATEGORY_FREETEXT)) {
    groups.push({ representative: category, members: [category], isOccupationField: false });
  }
  return groups;
}

export async function searchJobtechJobs(
  filters: JobtechFilters
): Promise<{ total: number; jobs: MappedJob[]; facets: JobtechFacets }> {
  // JobTech's `stats` aggregation silently drops some buckets under certain queries
  // (observed: "Data/IT" missing from occupation-field stats even unfiltered), so
  // facet counts are computed as exact drill-down counts instead: one small
  // limit=0 request per category/city, filtered by everything else the user has
  // already selected except that one facet (so counts reflect "how many ads if I
  // also picked this option", not the already-narrowed main result set).
  const categoryGroups = categoryFacetGroups();
  // "remote" resolves to remote=true and "hela" to no municipality filter at all —
  // buildJobtechParams already handles both via its normal city-resolution logic.
  const cityFacetIds = [...Object.keys(CITY_TO_MUNICIPALITY), "remote", "hela"];

  const [main, baseline, ...facetResponses] = await Promise.all([
    fetchJobtech(buildJobtechParams(filters)),
    // No category restriction at all — the baseline "ovrigt" is derived from.
    fetchJobtech(buildJobtechParams({ ...filters, categories: [], offset: 0, limit: 0 })),
    ...categoryGroups.map((group) =>
      fetchJobtech(buildJobtechParams({ ...filters, categories: [group.representative], offset: 0, limit: 0 }))
    ),
    ...cityFacetIds.map((cityId) =>
      fetchJobtech(buildJobtechParams({ ...filters, cities: cityId === "hela" ? [] : [cityId], offset: 0, limit: 0 }))
    ),
  ]);

  const categories: Record<string, number> = {};
  let mappedTotal = 0;
  categoryGroups.forEach((group, i) => {
    const count = facetResponses[i].total?.value ?? 0;
    for (const member of group.members) categories[member] = count;
    // Only sum the occupation-field groups: they partition the taxonomy, while the
    // freetext ones (kundservice/hr) can overlap with those fields and would double count.
    if (group.isOccupationField) mappedTotal += count;
  });
  // "Ovrigt" = ads outside every occupation-field we track — a real remainder, not a demo number.
  categories.ovrigt = Math.max(0, (baseline.total?.value ?? 0) - mappedTotal);

  const cities: Record<string, number> = {};
  cityFacetIds.forEach((cityId, i) => {
    cities[cityId] = facetResponses[categoryGroups.length + i].total?.value ?? 0;
  });

  return {
    total: main.total?.value ?? 0,
    jobs: (main.hits ?? []).map(mapHitToJob),
    facets: { categories, cities },
  };
}
