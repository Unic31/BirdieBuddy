/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, {useCallback, useEffect, useState} from 'react';
import Axios from "axios";
import "./FriendRequest.css";
import {Link, NavLink, useParams} from 'react-router-dom';
import Profile from "../image/user60.png";
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../header/Header';
import _ from "lodash"
import buddyrequest from '../image/buddyrequest.svg';
import acceptbuddy from '../image/acceptbuddy.svg';

function FriendRequest(props) {
    const url = process.env.REACT_APP_PROFILE;
    const [unum, setUnum]=useState('');
    const [funum, setFunum]=useState('');
    const [data,setData]=useState('');
    const now = new Date();
    const year = now.getFullYear();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const fetchMoreData=()=>{
        Axios.get("/login/unumChk")
        .then(res=> {
            setUnum(res.data);
            setFunum(res.data);
            setLoading(true);
                Axios
                    .get(`/friend/pagingrequestlist?unum=${res.data}&page=${page}&size=10`) // size=페이지 당 n개의 아이템을 요청하도록 수정
                    .then((res) => {
                        const newData = _.uniqBy([...items, ...res.data], 'fnum');
                        setItems(newData);
                        console.log(items);
                        console.log(res.data);
                        setPage((prevPage) => prevPage + 1);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("데이터를 더 가져오는 중 오류 발생:", error);
                        setLoading(false);
                    });
        });
    }
    useEffect(() => {
        fetchMoreData()
    }, [])




    const onAcceptEvent = (unum) => {
        const confirmed = window.confirm('신청을 수락하시겠습니까?');
            if (confirmed) {
                Axios.get(`/friend/acceptfriend/${unum}&${funum}`)
                    .then(res => {
                        alert("버디 추가 완료. 버디 리스트에서 확인하세요.");
                        window.location.replace(`/friend/requestlist`);
                    })
                    .catch(err => {
                        console.log(err.message);
                    });
            }
    };

    const onRequestingEvent = () => {
        alert("수락을 기다리거나 해당 사용자 프로필에 방문하여 요청을 취소하세요");
    }



    return (
        <div className="friendrequest">
            <div className="header"><Header/></div>
            <div className="FLtab">
                <NavLink to={`/friend/list`}>
                <div className="frframe">
                    <div className="FLdiv">버디 리스트</div>
                </div>
                </NavLink>
                <NavLink to={`/friend/requestlist`}>
                <div className="FRframe">
                    <div className="FLdiv">버디 요청</div>
                </div>
                </NavLink>
            </div>
            <div className='friendrequestlist'>
            <InfiniteScroll
                    dataLength={items.length}
                    next={fetchMoreData}
                    hasMore={items.length>0}
                    loader={<h4>마지막</h4>}
                    endMessage={null}
                >
            {
                items.map &&
                items.map((item,idx)=>

                    <div className="flist">
                                <div className="flistprofile1">
                                    <Link to={`/friend/detail/${item.unum}`} className="FDMoveLink">
                                    {item.uphoto == null ? <img className="FLphoto-icon" alt="" src={Profile} /> :
                                    <img className="FLphoto-icon" src={`${url}${item.uphoto}`} alt={''}/>}
                                    </Link>
                                    <div className="FLdiv3">
                                      <span className="FLtxt">
                                        <p className="FLp">{item.unickname}</p>
                                        <p className="FLp1">{item.ugender} / {year - (parseInt(item.uage.substring(0, 4), 10))}세</p>
                                      </span>
                                    </div>

                                    <div>
                                        {item.frequest == 2 ? 
                                        // <button type='button' className="FLdiv4" onClick={onRequestingEvent}>요청중</button>
                                        <img alt='' src={buddyrequest} className='FLrectangle-parent' onClick={onRequestingEvent}/>
                                        : 
                                        (
                                        // <button type='button' className="FLdiv4" onClick={onAcceptEvent.bind(null, item.unum)}>수락</button>
                                        <img alt='' src={acceptbuddy} className='FLrectangle-parent' onClick={onAcceptEvent.bind(null, item.unum)}/>
                                        )}
                                    </div>
                                </div>
                        </div>                    
                 )
            }
            </InfiniteScroll>
        </div></div>
    );
}

export default FriendRequest;