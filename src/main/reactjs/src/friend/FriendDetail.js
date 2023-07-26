import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Axios from "axios";
import "./FriendDetail.css";
import * as ncloudchat from 'ncloudchat';
import FDicon1 from "../image/icon_addbuddy.svg";
import FDicon2 from "../image/icon_buddychat.svg";
import FDicon3 from "../image/icon_buddystory.svg";

function FriendDetail(props) {
    const [unum, setUnum]=useState('');
    const [dto,setDto]=useState('');
    const {funum}=useParams('');
    const [checkbuddy, setCheckbuddy]=useState('');
    const [requestcheck,setRequestCheck]=useState([]);
    const [stasu, setStasu] = useState('');
    const [nc, setNc] = useState('');
    const navi=useNavigate();

    const unumchk = async () => {
        const res1 = await Axios.get("/login/unumChk");
        const unum = res1.data;
        setUnum(res1.data);

        const url = `/friend/checkbuddy?unum=${res1.data}&funum=${funum}`;
        const res2 = await Axios.get(url);
        setCheckbuddy(res2.data);

        const frurl = `/friend/requestcheck?unum=${res1.data}`;
        const res3 = await Axios.get(frurl);
        setRequestCheck(res3.data);

        const res4 = await Axios.get(`/login/getRtasu?unum=${funum}`);
        setStasu(res4.data);

        const getUserInfourl = `/chating/getuserinfo?unum=${unum}`;
        const res5 = await Axios.get(getUserInfourl);
        const userInfo = res5.data;

        const chat = new ncloudchat.Chat();
        chat.initialize('08c17789-2174-4cf4-a9c5-f305431cc506');
        setNc(chat);

        await chat.connect({
            id: res5.data.uemail,
            name: res5.data.unickname,
            profile: 'https://image_url',
            customField: 'json',
        });
    };

    useEffect(() => {
        unumchk();
    }, []);

    const getChatInfo = async (unum, cunum) => {
        try {
            console.log("getChatInfo");
            console.log("unum1: "+unum);
            console.log("unum2: "+cunum);
            const response = await Axios.get(`/chating/getchatinfo?unum1=${unum}&unum2=${cunum}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const onChatEvent = async (cunum) => {
        if (nc) {
            try {
                const chatid = await getChatInfo(unum, cunum);
                console.log("chatid:"+chatid);
                if (chatid) {
                    // chatid != null 일 경우
                    await nc.disconnect();
                    navi(`/chating/room/${chatid}/${unum}`);
                } else {
                    // chatid == null 일 경우
                    const newchannel = await nc.createChannel({ type: 'PUBLIC', name: String(unum) + " " + String(cunum)});
                    const newChatId = newchannel.id;
                    await nc.subscribe(newChatId);

                    await Axios.post("/chating/insertchatid", {unum, cunum, chatid: newChatId});

                    alert("정상적으로 생성되었습니다");
                    // 채팅방으로 이동
                    await nc.disconnect();
                    navi(`/chating/room/${newChatId}/${cunum}`);
                }
            } catch (error) {
                console.error('Error creating and subscribing channel:', error);
            }
        }
    };

    const selectData=useCallback(()=>{
        const url=`/friend/detail?funum=${funum}`;
        Axios({
            type:'get',
            url,
            // headers: {Authorization:`Bearer ${sessionStorage.token}`},
        }).then(res=>{
            setDto(res.data);
            console.log(res.data)
        })
    },[])

    useEffect(()=>{
            selectData();
    },[selectData]);

    const onRequestFriendEvent=(e)=>{
        e.preventDefault();
        const confirmed = window.confirm('버디 요청을 하시겠습니까?');
            if (confirmed) {
                Axios.post("/friend/requestfriend1", {unum, funum})
                    .then(res => {

                    })
                    .catch(err => {
                        console.log(err.message);
                    })
                Axios.post("/friend/requestfriend2", {unum, funum})
                    .then(res => {
                        alert("버디 요청이 되었습니다. 상대방이 수락시 버디리스트에서 확인 가능합니다.")
                        window.location.replace(`/friend/detail/${funum}`)
                    })
                    .catch(err => {
                        console.log(err.message);
                    })
            }
        }

    const onFriendCancelEvent=()=> {
        const confirmed = window.confirm('정말 취소하시겠습니까?');
        if (confirmed) {
            Axios.delete(`/friend/friendcancel/${unum}&${funum}`)
                .then(res => {
                    alert("정상적으로 취소되었습니다");
                    window.location.replace(`/friend/detail/${funum}`)
                })
                .catch(err => {
                    console.log(err.message);
                })
        }
    };

    const onAcceptEvent = () => {
        const confirmed = window.confirm('신청을 수락하시겠습니까?');
            if (confirmed) {
                Axios.get(`/friend/acceptfriend/${unum}&${funum}`)
                    .then(res => {
                        alert("버디 추가 완료. 버디 리스트에서 확인하세요.");
                        window.location.replace(`/friend/detail/${funum}`);
                    })
                    .catch(err => {
                        console.log(err.message);
                    });
            }
    };

    useEffect(() => {
        const disconnectChat = async () => {
            if (nc) {
                await nc.disconnect();
            }
        };

        window.addEventListener('beforeunload', disconnectChat);

        // When component unmounts, disconnect
        return () => {
            window.removeEventListener('beforeunload', disconnectChat);
            disconnectChat();
        };
    }, [nc]);

    return (
        <div className="FDprofile">
            <div className="FDdiv">
                <div className="FDchild" />
            </div>
            <div className="FDbackprofile" />
            <div className="FDinfobox" />
            <div className="FDmainprofile" />
            <div className="FDdiv2">
        <span className="FDtxt">
          <p className="FDp">{dto.uage} {dto.ugender==="1"?"남자":"여자"}</p>
          <p className="FDp">골프경력 {dto.ucareer} /&nbsp; 
          {
            stasu == null || stasu == '' || stasu == 0?
            <span> 입력된 타수 정보가 없습니다</span>:
            <span>
              평균타수 {stasu}타
            </span>
          }</p>
        </span>
            </div>
            <div className="FDdiv3">{dto.ucontent}</div>
            <div className="FDdiv4">{dto.unickname}</div>
            <div className="FDicon-message-parent">
                <img className="FDicon-message" alt="" src={FDicon2} />
                <div className="FDdiv5" onClick={onChatEvent.bind(null, funum)}>버디채팅</div>
            </div>
            <div className="FDicon-camera-parent">
                <img className="FDicon-camera" alt="" src={FDicon3} />
                <div className="FDdiv5">버디스토리</div>
            </div>
            {checkbuddy === 1 ? (
            <div className="FDparent" onClick={onFriendCancelEvent}>
                <div className="FDdiv5">버디 취소</div>
                <img
                    className="FDicon-user-cirlce-add"
                    alt="" src={FDicon1} />
            </div>
            ) : requestcheck.some((friend) => friend.funum == funum && friend.frequest == 2) ? (
                <div className="FDparent" onClick={onAcceptEvent}>
                <div className="FDdiv5">버디 요청 수락</div>
                <img
                    className="FDicon-user-cirlce-add"
                    alt="" src={FDicon1} />
                </div>
            ) : requestcheck.some((friend) => friend.funum == funum && friend.frequest == 1) ? (
                <div className="FDparent" onClick={onFriendCancelEvent}>
                <div className="FDdiv5">버디 요청 취소</div>
                <img
                    className="FDicon-user-cirlce-add"
                    alt="" src={FDicon1} />
                </div>
            ) : (
                <div className="FDparent" onClick={onRequestFriendEvent}>
            <div className="FDdiv5">버디 요청</div>
            <img
                className="FDicon-user-cirlce-add"
                alt="" src={FDicon1} />
        </div>
            )}
        </div>
            

    );
}

export default FriendDetail;