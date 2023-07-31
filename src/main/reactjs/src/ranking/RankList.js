/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import "../header/Header.css";
import Header from "../header/Header";
import Axios from "axios";
import "./RankingList.css";
import user from "../images/default_golf.png";
import Footer from "../footer/Footer";
import InfiniteScroll from "react-infinite-scroll-component";
import _ from "lodash"

function RankList(props) {
    const [unum, setUnum] = useState(0);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const url = process.env.REACT_APP_PROFILE;
    const medal = process.env.REACT_APP_RANKING;
    const image1 = process.env.REACT_APP_IMAGE1PROFILE;
    const image2 = process.env.REACT_APP_IMAGE87;

    useEffect(() => {
        unumchk();
        getList();
    }, []);

    const unumchk = () => {
        Axios.get("/login/unumChk?unum=" + unum)
            .then(res => {
                setUnum(res.data);
            })
    }

    function scrollToUnumItem(unum) {
        //alert(unum);
        const unumItem = document.querySelector(`[data-unum="${unum}"]`);
        if (unumItem) {
            unumItem.scrollIntoView({ behavior: "smooth" });
        }
    }

    const getList = () => {
        Axios.get(`/score/list?page=${page}&size=7`)
            .then(res => {
                const newData = _.uniqBy([...list, ...res.data], 'rnum');
                setList(newData);
                setPage((prevPage) => prevPage + 1);
                setLoading(false);
            })
            .catch((error) => {
                console.error("데이터를 더 가져오는 중 오류 발생:", error);
                setLoading(false);
            });
    }
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <div className='rankingList_wrap'>
            <div className='header'>
                <Header />
            </div>
            {/* <div>
                <Link to="/score/form">스코어 입력</Link>
            </div> */}

            <div className='ranking_List'  style={{ backgroundImage: 'url(http://kr.object.ncloudstorage.com/bit701-bucket-111/birdiebuddy/ranking/golf_ranking.jpg)' }}>
                <div className='ranking_search'>
                    <div style={{ visibility: 'hidden' }} >dd</div>
                    <div>
                        <button type='button' onClick={() => scrollToUnumItem(unum)}>
                            내 순위
                        </button>
                    </div>
                </div>
                <InfiniteScroll
                    dataLength={list.length}
                    next={getList}
                    hasMore={true}
                    loader={loading ? ( // 로딩 상태에 따른 메시지 표시
                        <div className="spinner-border text-primary" style={{marginLeft: "140px", overflow: "none"}}></div>
                    ) : (
                        null
                    )}
                    endMessage={<div style={{height:'50px',padding:'10px',textAlign:'center',fontSize:'15px'}}  onClick={scrollToTop}>
                        Scroll to Top
                    </div>}
                >
                    {
                        list &&
                        list.map((item, idx) => (

                            <div className='ranking_wrap'>
                                <div className={`ranking_mem rank${idx + 1}`} key={idx} style={{ backgroundImage: item.uphoto != null ? `url(${image1}${item.uphoto}${image2})` : `url(../images/default_golf.png)`, backgroundSize: 'cover' }}
                                    data-unum={item.unum}>

                                    <div
                                        className="overlay"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.7)', // 배경 색상과 투명도 조절
                                        }}
                                    />

                                    {item.uphoto != null ? (
                                        <div className='ranking_profile'>
                                            <img alt='프로필 사진' src={`${image1}${item.uphoto}${image2}`} />
                                        </div>
                                    ) : (
                                        <div className='ranking_profile'>
                                            <img alt='프로필 사진' src={user} />
                                        </div>
                                    )}


                                    <div className='ranking_mid'>
                                        <div className='ranking_nickname'>{item.unickname} 님</div>

                                        <div className='ranking_tasu'>{item.rtasu} 타</div>
                                    </div>


                                    <div>
                                        <div className='ranking_place'>
                                            {idx + 1 === 1 ? <img alt='' src={`${medal}gold-medal.png`} /> :
                                                idx + 1 === 2 ? <img alt='' src={`${medal}silver-medal.png`} /> :
                                                    idx + 1 === 3 ? <img alt='' src={`${medal}bronze-medal.png`} /> :
                                                        <span>{`${idx + 1}th`}</span>}
                                        </div>
                                    </div>


                                    <div className='ranking_neck'></div>




                                </div>
                            </div>
                        ))}
                    {list.length > 0 && !loading && (
                        <button style={{height:'50px',marginLeft:'130px',padding:'10px',textAlign:'center',fontSize:'18px',opacity:'0.5',backgroundColor:'transparent'}} onClick={scrollToTop}>
                            Scroll to Top
                        </button>
                    )}
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default RankList;
