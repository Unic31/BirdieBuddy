import React, {useEffect, useState} from 'react';
import './List.css';
import Avatar from '@mui/material/Avatar';
import MessageIcon from '@mui/icons-material/Message';
import {useNavigate} from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import Axios from 'axios';
import {FavoriteBorder, FavoriteSharp} from "@mui/icons-material";
import Profile from "../image/User-32.png";
import KakaoImg from "../image/kakao.svg";
import TweetterImg from "../image/newTwitter.png";
import ShareImg from "../image/share_2.png";
import CommetImg from "../image/share30.png";
import FacebookImg from "../image/facebookimg.png";
import InstarImg from "../image/instar.png";
function HugiRowList(props) {
    const {hnum, hcontent, hphoto, hwriteday, hlike} = props;
    // const unickname="test";
    const URL = process.env.REACT_APP_HUGI;
    const URL2=process.env.REACT_APP_HUGI2;
    const URL3 = process.env.REACT_APP_HUGI_325;
    const image1 = process.env.REACT_APP_IMAGE1PROFILE;
    const image2 = process.env.REACT_APP_IMAGE87;

    const navi = useNavigate();

    const [open, setOpen] = React.useState(false);
    const [openReplyForm, setOpenReplyForm] = useState(null);
    const [showLike, setShowLike] = useState(props.showLike || false);
    const [funum, setFunum]=useState('');
    const [unum, setUnum]=useState('');
    const [uphoto,setUphoto]=useState('');
    const [rhnum, setRhnum] = useState(null);
    const [rhcontent, setRhcontent] = useState('');
    const [comments, setComments] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [postUserNickname, setPostUserNickname] = useState();

    const [commentError, setCommentError] = useState(false); // 댓글 입력 오류 여부 상태 추가
    const [replyError, setReplyError] = useState(false); // 대댓글 입력 오류 여부 상태 추가
    const [errorCommentId, setErrorCommentId] = useState(null); // 오류가 발생한 대댓글의 ID 상태 추가

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isIconsVisible, setIsIconsVisible] = useState(false);
    // handleClickModify 함수: 게시물 수정 클릭 이벤트 처리 함수
    const handleClickModify = (hnum) =>{
        if (unum === 0) {
            alert('로그인을 먼저 해주세요!');
        } else {
            // console.log("unickname>>"+postUserNickname);//success
            // console.log("hnum,unum,hphoto,hcontent,hlike>>"+hnum+","+unum+","+hphoto+","+hcontent+","+hlike);//success
            navi(`/hugi/modify/${hnum}`, {
                hnum: hnum,
                unum: unum,
                uphoto:uphoto,
                hlike: hlike,
                postUserNickname: postUserNickname,
                hcontent: hcontent,
                hphoto: hphoto,
                hwriteday: hwriteday,
            });
        }
    };

    const apiURL = 'http://223.130.137.128/apihugi/shortenUrl'; // 스프링 백엔드의 컨트롤러 URL
    const longUrl = `http://223.130.137.128/hugi/detail/${hnum}`; // 단축시킬 원본 URL 입력 ,hnum도 잘 받아옴
    // handleClickShare 함수: 게시물을 SNS에 공유하는 클릭 이벤트 처리 함수
    const handleClickShare = () => {
        generateShortURL(longUrl);
    };
    const shareTweet=()=>{
        generateShortURL_T(longUrl);
    };
    const shareToFacebook =() =>{
        generateShortURL_F(longUrl);
    }
    const shareInstar =()=>{
        generateShortURL_I(longUrl);
    }
    // generateShortURL 함수: 입력된 URL을 단축 URL로 생성하는 함수
    const generateShortURL  = async (longUrl) => {
        const client_id = '8cvbhm3fzt'; // 본인의 클라이언트 아이디값
        const client_secret = 'j1cXNz7BdAeQ7SFB6H8HoKzSqkvLOIgkqYMs3a3N'; // 본인의 클라이언트 시크릿값
        // const longUrl = 'http://devster.kr/'; // 짧게 만들고 싶은 URL 입력칸입니다!!! (젠킨스주소 넣어보기)

        const requestData = {
            url: longUrl, // 서버에서 단축시킬 URL 대신에 목록 URL을 보냄
            client_id: client_id,
            client_secret: client_secret,
        };
        try {
            const response = await Axios.post(apiURL, requestData);
            const generatedURL = response.data.result.url;
                    shareShortenedURL(generatedURL); // 단축 URL을 생성하고 나서 SNS 공유 함수 호출
                    copyToClipboard(generatedURL); // 클립보드에 복사
        }catch(error) {
                // console.error('Error generating shortened URL:', error);
            }
    };
    const generateShortURL_T  = async (longUrl) => {
        const client_id = '8cvbhm3fzt'; // 본인의 클라이언트 아이디값
        const client_secret = 'j1cXNz7BdAeQ7SFB6H8HoKzSqkvLOIgkqYMs3a3N'; // 본인의 클라이언트 시크릿값
        // const longUrl = 'http://devster.kr/'; // 짧게 만들고 싶은 URL 입력칸입니다!!! (젠킨스주소 넣어보기)

        const requestData = {
            url: longUrl, // 서버에서 단축시킬 URL 대신에 목록 URL을 보냄
            client_id: client_id,
            client_secret: client_secret,
        };
        try {
            const response = await Axios.post(apiURL, requestData);
            const generatedURL = response.data.result.url;
            // 단축된 URL 값
            shareTweet2(generatedURL);
        }catch(error) {
            // console.error('Error generating shortened URL:', error);
        }
    };
    const generateShortURL_F  = async (longUrl) => {
        const client_id = '8cvbhm3fzt'; // 본인의 클라이언트 아이디값
        const client_secret = 'j1cXNz7BdAeQ7SFB6H8HoKzSqkvLOIgkqYMs3a3N'; // 본인의 클라이언트 시크릿값
        // const longUrl = 'http://devster.kr/'; // 짧게 만들고 싶은 URL 입력칸입니다!!! (젠킨스주소 넣어보기)

        const requestData = {
            url: longUrl, // 서버에서 단축시킬 URL 대신에 목록 URL을 보냄
            client_id: client_id,
            client_secret: client_secret,
        };
        try {
            const response = await Axios.post(apiURL, requestData);
            const generatedURL = response.data.result.url;
            // 단축된 URL 값
            shareToFacebook2(generatedURL);
        }catch(error) {
            // console.error('Error generating shortened URL:', error);
        }
    };
    const generateShortURL_I  = async (longUrl) => {
        const client_id = '8cvbhm3fzt'; // 본인의 클라이언트 아이디값
        const client_secret = 'j1cXNz7BdAeQ7SFB6H8HoKzSqkvLOIgkqYMs3a3N'; // 본인의 클라이언트 시크릿값
        // const longUrl = 'http://devster.kr/'; // 짧게 만들고 싶은 URL 입력칸입니다!!! (젠킨스주소 넣어보기)

        const requestData = {
            url: longUrl, // 서버에서 단축시킬 URL 대신에 목록 URL을 보냄
            client_id: client_id,
            client_secret: client_secret,
        };
        try {
            const response = await Axios.post(apiURL, requestData);
            const generatedURL = response.data.result.url;
            // 단축된 URL 값
            shareToInstar2(generatedURL);
        }catch(error) {
            // console.error('Error generating shortened URL:', error);
        }
    };
    // shareShortenedURL 함수: 단축 URL을 SNS에 공유하는 함수
    const shareShortenedURL = (url) => {
        if (navigator.share)// navigator.share() API를 지원하는 경우
        {
            const tweetText = '버디버디 라운딩 후기입니다. ' + url; // 링크를 포함한 원하는 텍스트 생성

            navigator.share({
                title: '버디버디',
                text:tweetText,
                url: url,
            })
                .then(() => {
                    console.log('URL 공유 성공!');
                    // setSnackbarOpen(true); // URL이 복사되면 Snackbar를 엽니다.
                })
                .catch((error) => {
                    // console.error('URL 공유 중 오류 발생:', error);
                });
        } else {
            // navigator.share() API를 지원하지 않는 브라우저를 위한 대체 방법
            // 메시지를 사용자에게 보여주거나 다른 접근 방식을 사용할 수 있습니다.
            const tweetText = '버디버디 라운딩 후기입니다. ' + url; // 링크를 포함한 원하는 텍스트 생성
            const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
            window.open(twitterShareURL, '_blank');
            // alert('이 링크를 공유하세요: ' + url);
            // copyToClipboard(url);// 클립보드에 복사하는 함수 호출
        }
    };
    // copyToClipboard 함수: 주어진 텍스트를 클립보드에 복사하는 함수
    const copyToClipboard = (text) => {
        // Clipboard API를 사용하여 클립보드에 복사
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('URL 복사 완료!!:', text);
                setSnackbarOpen(true); // URL이 복사되면 Snackbar를 엽니다.
            })
            .catch((error) => {
                // console.error('클립보드 복사 중 오류 발생:', error);
            });
    };

    const shareTweet2 = (turl) => {

        //     const tweetText = '버디버디 라운딩 후기입니다. ' + `http://223.130.137.128/hugi/detail/${hnum}`; // 링크를 포함한 원하는 텍스트 생성
        const tweetText = '버디버디 라운딩 후기입니다. ' + turl;
        const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
            window.open(twitterShareURL, '_blank');
    };
    const shareToFacebook2 = (furl) => {
        // const urlToShare = 'http://223.130.137.128/hugi/detail/' + hnum; // 이 주소가 실제 공유하고자 하는 페이지 주소와 일치해야 함
        const urlToShare =  furl;
        const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`;
        window.open(facebookShareURL, '_blank');
    };
    const shareToInstar2 = () => {
        // const instagramAppUrl = "instagram://camera"; // 인스타그램 앱을 실행하는 URL
        const webFallbackUrl = "https://www.instagram.com/"; // 웹 버전 인스타그램 URL
        // 인스타그램 앱이 설치되어 있는 경우 앱으로 전환
        // window.open(instagramAppUrl, '_blank');
        // 인스타그램 앱이 설치되어 있지 않은 경우 웹 버전으로 이동
        window.open(webFallbackUrl, '_blank');
    };
    // handleSnackbarClose 함수: Snackbar 닫는 이벤트 처리 함수
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    // Snackbar 표시를 위한 useEffect
    useEffect(() => {
        if (snackbarOpen) {
            // TODO: Snackbar를 표시하는 로직을 구현합니다.
            // 예를 들어, Material-UI의 Snackbar 컴포넌트를 사용하여 표시할 수 있습니다.
            //setSnackbarOpen(false); // Snackbar를 표시하고 나서 상태를 다시 false로 변경
        }
    }, [snackbarOpen]);
// unumchk 함수: 로그인된 사용자의 unum 값을 확인하는 함수
    const unumchk=()=>{
        Axios.get("/apilogin/unumChk")
            .then(res=> {
                setUnum(res.data);
            });
    }
    // 초기 로딩 시에 unumchk 함수 호출
    useEffect(() => {
        unumchk()
    }, [])

    const handleClickOpen = () => {
        if (unum === 0) {
            alert('로그인을 먼저 해주세요!');
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleClickAvatar = (funum) => {
        if (unum === 0) {
            alert('로그인을 먼저 해주세요!');
        } else if (funum === unum) {
            navi(`/mypage/mypage/${unum}`);
        } else {
            navi(`/friend/detail/${funum}`);
        }
    };

    // handleClickLikeOn 함수: 좋아요 누르기 이벤트 처리 함수
    const handleClickLikeOn = () => {
        // 서버에 좋아요 정보를 전달하고, 성공적으로 처리되면
        // setShowLike(true)를 호출하여 버튼을 활성화합니다.
        Axios.post(`/apihugi/like/${hnum}`)
            .then(() => {
                alert("좋아요를 눌렀습니다!");
                localStorage.setItem(`likeStatus_${hnum}`, "true"); // 좋아요 상태 저장
                setShowLike(true);
            })
            .catch((error) => {
                // console.log('좋아요 처리 중 오류가 발생했습니다.', error);
            });
    };
    // handleClickLikeOff 함수: 좋아요 취소하기 이벤트 처리 함수
    const handleClickLikeOff = () => {
        // 서버에 좋아요 정보를 전달하고, 성공적으로 처리되면
        // setShowLike(false)를 호출하여 버튼을 비활성화합니다.
        Axios.delete(`/apihugi/unlike/${hnum}`)
            .then(() => {
                alert("좋아요를 취소했습니다!");
                localStorage.setItem(`likeStatus_${hnum}`, "false"); // 좋아요 상태 저장
                setShowLike(false);
            })
            .catch((error) => {
                // console.log('좋아요 취소 처리 중 오류가 발생했습니다.', error);
            });
    };
    // handleClickDelete 함수: 게시물 삭제 이벤트 처리 함수
    const handleClickDelete = () => {
        if (parseInt(unum)===1||parseInt(props.unum) === parseInt(unum)) {
            const confirmed = window.confirm('정말 삭제하시겠습니까?');
            if (confirmed) {
                deleteAllComments()
                    .then(() => {
                        Axios.delete(`/apihugi/delete/${hnum}`)
                            .then(() => {
                                console.log('게시물이 성공적으로 삭제되었습니다.');
                                window.location.reload();
                            })
                            .catch((error) => {
                                // console.log('게시물 삭제 중 오류가 발생했습니다.', error);
                            });
                    })
                    .catch((error) => {
                        // console.log('댓글과 답글 삭제 중 오류가 발생했습니다.', error);
                    });
            }
        } else {
            alert('자신이 작성한 게시물만 삭제할 수 있습니다.');
        }
    };
    // deleteAllComments 함수: 게시물에 해당하는 모든 댓글과 대댓글을 삭제하는 함수
    const deleteAllComments = () => {
        return new Promise((resolve, reject) => {
            Axios.delete(`/apirehugi/deleteAllComments/${hnum}`)
                .then(() => {
                    console.log('댓글과 답글이 성공적으로 삭제되었습니다.');
                    resolve();
                })
                .catch((error) => {
                    // console.log('댓글과 답글 삭제 중 오류가 발생했습니다.', error);
                    reject(error);
                });
        });
    };
    // handleDeleteComment 함수: 특정 댓글을 삭제하는 함수
    const handleDeleteComment = (rhnum) => {
        Axios.delete(`/apirehugi/deletecomment/${rhnum}`)
            .then(() => {
                console.log('댓글 삭제 완료');
                getComments();
            })
            .catch((error) => {
                // console.log('댓글 삭제 중 오류가 발생함', error);
            });
    };
    // handleClickDeleteComment 함수: 댓글 삭제 이벤트 처리 함수
    const handleClickDeleteComment = (rhnum) => {
        const confirmed = window.confirm('정말 삭제하시겠습니까?');
        if (confirmed) {
            handleDeleteComment(rhnum);
        }
    };
    // getComments 함수: 게시물에 해당하는 모든 댓글과 대댓글을 가져오는 함수
    // getComments 함수 내부에서도 setNickname을 호출하여 unickname 값을 설정합니다.
    const getComments = () => {
        Axios.get(`/apirehugi/comments?hnum=${hnum}`)
            .then((res) => {
                const sortedComments = sortComments(res.data);
                // console.log(res.data)
                setComments(sortedComments);

                res.data.forEach((comment) => {
                    fetchCommentUserPhoto(comment.unum, comment); // 댓글 작성자의 프로필 사진 정보 가져오기
                    if (comment.comments) {
                        comment.comments.forEach((reply) => {
                            fetchReplyUserPhoto(reply.unum, reply); // 대댓글 작성자의 프로필 사진 정보 가져오기
                        });
                    }
                });
                setComments(sortedComments);
            })
            .catch((error) => {
                // console.log(error);
            });
    };
    // fetchPostUserNickname 함수: 게시물 작성자의 닉네임을 가져오는 함수
    const fetchPostUserNickname = async (unum) => {
        if (unum) {
            try {
                const res = await Axios.get(`/apihugi/getUser/${unum}`);
                const Unickname = res.data;

                if (Unickname) {
                    setPostUserNickname(Unickname);

                }
            } catch (error) {

            }
        }
    };
    const fetchUserPhoto = (unum) => {
        Axios.get(`/apihugi/getUserPhoto/${unum}`)
            .then((res) => {
                const userPhoto = res.data;
                setUphoto(userPhoto);
            })
            .catch((error) => {

            });
    };
// 댓글 작성자의 프로필 사진 정보를 가져오는 함수
    const fetchCommentUserPhoto = (unum, comment) => {
        Axios.get(`/apihugi/getUserPhoto/${unum}`)
            .then((res) => {
                const userPhoto = res.data;
                // comment 객체에 댓글 작성자의 프로필 사진 정보 추가
                comment.uphoto = userPhoto;
                // state 업데이트 등의 작업을 수행할 수 있습니다.
                setComments((prevComments) => [...prevComments]); // 댓글 정보가 추가된 새로운 배열로 state 업데이트
            })
            .catch((error) => {

            });
    };

// 대댓글 작성자의 프로필 사진 정보를 가져오는 함수
    const fetchReplyUserPhoto = (unum,reply) => {
        Axios.get(`/apihugi/getUserPhoto/${unum}`)
            .then((res) => {
                const userPhoto = res.data;
                // reply 객체에 대댓글 작성자의 프로필 사진 정보 추가
                reply.uphoto = userPhoto;
                // state 업데이트 등의 작업을 수행할 수 있습니다.
                setComments((prevComments) => [...prevComments]); // 대댓글 정보가 추가된 새로운 배열로 state 업데이트
            })
            .catch((error) => {

            });
    };
    // handleClickDetail 함수: 게시물 상세 페이지 이동 이벤트 처리 함수
    const handleClickDetail = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

            navi(`/hugi/detail/${hnum}`, {
                userNum: unum,
                hnum: hnum,
                hphoto: hphoto,
                hcontent: hcontent,
                hwriteday: formattedDate,
                uphoto:uphoto,
                Unickname: props.Unickname // Unickname 매개변수를 사용합니다.
                // 여기에 다른 데이터도 추가할 수 있습니다.

            });
            fetchPostUserNickname(unum); // fetchPostUserNickname 함수에 unum 전달
            fetchUserPhoto(unum);
            // console.log("unum>>"+unum);
            window.location.reload();
    };
    // sortComments 함수: 댓글과 대댓글을 정렬하는 함수
    const sortComments = (comments) => {
        const sorted = [];
        const commentMap = {};

        for (const comment of comments) {
            if (!comment.ref) {
                sorted.push(comment);
                commentMap[comment.rhnum] = comment;
            }
        }

        for (const comment of comments) {
            if (comment.ref) {
                const parentComment = commentMap[comment.ref];
                if (parentComment) {
                    if (!parentComment.comments) {
                        parentComment.comments = [];
                    }
                    parentComment.comments.push(comment);
                    // fetchUserNickname(comment.unum, comment); // 대댓글 작성자의 unickname 가져오기
                }
            }
        }

        return sorted;
    };
    // handleCommentSubmit 함수: 댓글 작성 폼을 제출하는 함수
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (rhcontent.trim() === '') {
            setCommentError(true);
            return;
        }

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

        try {
            const res = await Axios.get(`/apihugi/getUser/${unum}`);
            const userNickname = res.data;
            if (userNickname) {
                const newComment = {
                    rhnum: rhnum,
                    hnum: hnum,
                    unum: unum,
                    uphoto:uphoto,
                    rhcontent: rhcontent,
                    rhwriteday: formattedDate,
                    ref: null,
                    step: null,
                    depth: null,
                };

                await Axios.post('/apirehugi/newcomment', newComment);
                getComments();
                setRhcontent('');
                setCommentError(false);
            }
        } catch (error) {
            // console.log('오류가 발생했습니다.', error.message);
        }
    };
    // submitReply 함수: 댓글에 대한 대댓글을 작성하는 함수
    const submitReply = (comment) => {
        if (replyContent.trim() === '') {
            setReplyError(true);
            setErrorCommentId(comment.rhnum);
            return;
        }

        const newReply = {
            hnum: hnum,
            unum: unum,
            uphoto:uphoto,
            rhcontent: replyContent,
            ref: comment.rhnum,
            step: comment.step + 1,
            depth: comment.depth + 1,
        };

        Axios.post("/apirehugi/newreply?unum=" + unum, newReply)
            .then((res) => {
                console.log('댓글이 성공적으로 추가되었습니다.');
                getComments();
                toggleReplyForm(comment.rhnum);
                setReplyError(false);
                setErrorCommentId(null);
            })
            .catch((error) => {
                // console.log('댓글 추가 중 오류가 발생했습니다.', error);
            });
    };

    const MAX_COMMENT_LENGTH = 45;
    //45자 제한
    // handleCommentChange 함수: 댓글 내용 변경 이벤트 처리 함수
    const handleCommentChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= MAX_COMMENT_LENGTH) {
            setRhcontent(inputValue);

        }
    };
    // toggleReplyForm 함수: 대댓글 작성 폼 열기/닫기 이벤트 처리 함수
    const toggleReplyForm = (rhnum) => {
        if (openReplyForm === rhnum) {
            setOpenReplyForm(null);
        } else {
            setOpenReplyForm(rhnum);
        }
        setReplyContent('');
    };


    const { Kakao } = window;
    // 배포한 자신의 사이트
    const realUrl = `http://223.130.137.128/hugi/detail/${hnum}`;
    // 로컬 주소 (localhost 3000 같은거)
    const resultUrl = `http://localhost:3000/hugi/detail/${hnum}`;

        // 재랜더링시에 실행되게 해준다.
        useEffect(()=>{
            // init 해주기 전에 clean up 을 해준다.
            Kakao.cleanup();
            // 자신의 js 키를 넣어준다.
            Kakao.init('82d531473f9f3c5fc093e4d7e3225bc7');
            // 잘 적용되면 true 를 뱉는다.
            console.log(Kakao.isInitialized());
        },[]);

        const shareKakao = () =>{

            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '버디버디 라운딩 후기',
                    description: '골프, 조인, 양도, 후기, 스코어',
                    imageUrl:
                        `${URL2}${hphoto}${URL3}`,
                    link: {
                        webUrl:realUrl,
                        mobileWebUrl: realUrl,
                    },
                },
                buttons: [
                    {
                        title: '라운딩 후기 보러가기',
                        link: {
                            webUrl:realUrl,
                            mobileWebUrl: realUrl,
                        },
                    },
                ],
            });
        }
    const toggleIcons = () => {
        setIsIconsVisible((prev) => !prev);
    };
    // useEffect를 이용하여 초기 데이터 로딩
    useEffect(() => {
        getComments();
    }, [hnum, unum]);
    // useEffect를 이용하여 게시물 작성자의 닉네임 가져오기
    useEffect(() => {
        fetchPostUserNickname(props.unum);
    }, [props.unum]);
    // useEffect를 이용하여 좋아요 상태 설정
    useEffect(() => {
        // 페이지가 로드될 때 localStorage에서 좋아요 상태를 불러와서 적용
        const likeStatus = localStorage.getItem(`likeStatus_${hnum}`);
        setShowLike(likeStatus === "true");
    }, [hnum]); // hnum이 변경될 때마다 실행



    return (
        <div className="HG_list">
            <div className="HG_list_header">
                {props.uphoto == null ? (
                    <Avatar className="HG_list_avatar" alt={'error'}  src={Profile}  onClick={handleClickAvatar.bind(null,props.unum)}/>
                ):(
                    <Avatar className="HG_list_avatar" alt={''} src={`${image1}${props.uphoto}${image2}`} onClick={handleClickAvatar.bind(null,props.unum)}/>
                )}
                <span className="HG_spanName" onClick={handleClickAvatar.bind(null,props.unum)}>{postUserNickname}</span>
            </div>
            &nbsp;
            <span className="HG_spanWriteday">{hwriteday}</span>
            <div className="HG_list_div_image">
               <img src={`${URL2}${hphoto}${URL3}`} alt="" className ="HG_list_image" value={hphoto} onClick={handleClickDetail}/>
            </div>
                <h6 className="HG_list_text">
                &nbsp;
                {hcontent}
            </h6>
            <hr/>
            <div className="HG_IconsZone">
                {unum !== 0 && (showLike ? (
                    <FavoriteSharp onClick={handleClickLikeOff} className="HG_Icons" style={{color: "red",width:'30px',height:'28px'}}/>
                ) : (
                    <FavoriteBorder onClick={handleClickLikeOn} className="HG_Icons" style={{color: "red",width:'30px',height:'28px'}}/>
                ))}
                <img src={CommetImg} alt={''} onClick={handleClickOpen} className="HG_CommentIcons"/>
                <img  alt='' src={ShareImg} className="HG_ShareIcons" onClick={toggleIcons}/>
                {(parseInt(unum) === 1 || parseInt(props.unum) === parseInt(unum)) && (
        <EditIcon onClick={() => handleClickModify(hnum)} className="HG_Icons"/>
    )}
    {(parseInt(unum) === 1 || parseInt(props.unum) === parseInt(unum)) && (
        <DeleteIcon onClick={handleClickDelete} className="HG_Icons"/>
    )}
                {isIconsVisible && (
                    <div className="HG_ShareSNS">
                         <div className="HG_KakaoIcons" >
                             <img src={KakaoImg} alt={''}
                                    className="HG_KakaoImg"
                                    onClick={() => {shareKakao()}}>
                            </img>
                         </div>
                        <div className="HG_InstarIcons">
                            <img src={InstarImg} alt={''}
                                 className="HG_InstarImg"
                                 onClick={() => {shareInstar()}}
                            >
                            </img>
                        </div>
                        <div className="HG_FacebookIcons">
                            <img src={FacebookImg} alt={''} className="HG_FacebookImg"
                                 onClick={()=> {shareToFacebook()}}>
                            </img>
                        </div>
                         <div className="HG_TweetterIcons">
                             <img src={TweetterImg} alt={''} className="HG_TweetterImg"
                                 onClick={() => {shareTweet()}}>
                             </img>
                        </div>
                        <ShareIcon onClick={handleClickShare} className="HG_ShareApiIcons"/>
                    </div>
                )}

            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <div className="HG_Dialog_Title">

                        {props.uphoto !== null ? (
                            <Avatar className="HG_list_avatar_Comment1" alt={''} src={`${image1}${props.uphoto}${image2}`} onClick={handleClickAvatar.bind(null,props.unum)}/>
                        ):(
                            <Avatar className="HG_list_avatar_Comment1" alt={''} src={Profile} onClick={handleClickAvatar.bind(null,props.unum)}/>
                        )}
                        <span className="HG_spanCommentList" onClick={handleClickAvatar.bind(null,props.unum)}>
                        {postUserNickname}
                      </span>
                    </div>
                </DialogTitle>
                <DialogContent style={{width: '100%', overflowX: 'hidden'}}>
                    <div style={{textAlign:'center'}}>
                    <img className="HG_list_image" src={`${URL2}${hphoto}${URL3}`} alt="" value={hphoto}/>
                    </div>
                   <DialogContentText id="alert-dialog-description" style={{width:'100%',height:'100%',fontSize:'15px',padding:'10px',margin:'auto'}}>
                        {hcontent}
                    </DialogContentText>
                    {unum && (
                        <div className="input-group">
              <textarea
                  className="form-control"
                  style={{
                      width: '70%',
                      height: '50px',
                      border: '1px solid lightgray',
                      fontSize: '12px',
                      resize: 'none',
                  }}
                  placeholder="댓글을 작성해 보세요"
                  value={rhcontent}
                  onChange={handleCommentChange}
              ></textarea>
                            <button type="button" className="HG_button_Comment" onClick={handleCommentSubmit}>
                                댓글 작성
                            </button>
                        </div>
                    )}

                    {commentError && (
                        <div>
                            <pre className="HG_CommentAlert">댓글을 입력해주세요.</pre>
                        </div>
                    )}
                    <div className="HG_preComment">
  {comments && comments.length > 0 ? (
      comments.map((comment) => (
          <div key={comment.rhnum} style={{overflowX: 'hidden'}}>
              <div className="HG_Comments">
                  <span className="HG_Commentname" onClick={handleClickAvatar.bind(null,comment.unum)}>{comment.unickname}</span>
                  {comment.uphoto !== null ? (
                      <Avatar className="HG_list_avatar_Comment2" alt={''} src={`${image1}${comment.uphoto}${image2}`} onClick={handleClickAvatar.bind(null,comment.unum)}/>
                  ):(
                      <Avatar className="HG_list_avatar_Comment2" alt={''}  src={Profile} onClick={handleClickAvatar.bind(null,comment.unum)}/>
                  )}
                  <pre className="HG_preRhcontent">{comment.rhcontent}</pre>
                  <br/>
                  <span className="HG_spanRhwriteday">{comment.rhwriteday}</span>
                  {unum && (
                      <a className="HG_Click_ReplyForm" onClick={() => toggleReplyForm(comment.rhnum)}>
                          {openReplyForm === comment.rhnum ? '닫기' : '댓글'}
                      </a>
                  )}
                  {(parseInt(unum) === 1||parseInt(comment.unum) === parseInt(unum)) && (
                      <DeleteIcon
                          className="HG_Delete_Icon"
                          onClick={() => handleClickDeleteComment(comment.rhnum)}
                      />
                  )}
              </div>
              {openReplyForm === comment.rhnum && unum && (
                  <div className="input-group" style={{width:"225px",marginLeft:"10px"}}>
            <textarea
                className="form-control"
                style={{
                    width: '67%',
                    height: '40px',
                    border: '1px solid lightgray',
                    fontSize: '12px',
                    resize: 'none',
                }}
                placeholder="댓글을 작성해 보세요"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
            ></textarea>
                      <button
                          type="button"
                          className="HG_button_Reply"
                          onClick={() => submitReply(comment)}
                      >
                          댓글 작성
                      </button>
                  </div>
              )}
              {replyError && comment.rhnum === errorCommentId && (
                  <div>
                      <pre className="HG_ReplyAlert">댓글을 입력해주세요.</pre>
                  </div>
              )}
              {comment.comments && comment.comments.length > 0 && (
                  <details className="HG_details_Reply">
                      <summary style={{fontSize:'12px'}}>댓글보기</summary>
                      {comment.comments &&
                          comment.comments.map((reply) => (
                              <div key={reply.rhnum} className="HG_Comment_Reply_List">
                                  {reply.uphoto !== null ? (
                                      <Avatar className="HG_list_avatar_Reply" alt={''} src={`${image1}${reply.uphoto}${image2}`} onClick={handleClickAvatar.bind(null,reply.unum)}/>
                                  ):(
                                      <Avatar className="HG_list_avatar_Reply" alt={''} src={Profile} onClick={handleClickAvatar.bind(null,reply.unum)}/>
                                  )}
                                  <b className="HG_ReplyNickname" onClick={handleClickAvatar.bind(null,reply.unum)}>
                                      {reply.unickname}
                                  </b>
                                  &nbsp;
                                  <pre className="HG_preReplyRhcontent">{reply.rhcontent}</pre>
                                  <br/>
                                  <span className="HG_spanReplyRhwriteday">{reply.rhwriteday}</span>
                                  {(parseInt(unum)===1||parseInt(reply.unum) === parseInt(unum)) && (
                                      <DeleteIcon
                                          className="HG_ReplyDelete_Icon"
                                          onClick={() => handleClickDeleteComment(reply.rhnum)}
                                      />
                                  )}
                              </div>
                          ))}
                  </details>
              )}
          </div>
      ))
  ) : (
      <p className="HG_NoComments">댓글이 없습니다.</p>
  )}
</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snackbarOpen}
                autoHideDuration={3000} // 3초 후 자동으로 사라집니다.
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{
                        width: '100%',
                        '& .MuiAlert-action': {
                            alignItems: 'center', // 아이콘을 세로 가운데 정렬합니다.
                        },
                    }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleSnackbarClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    URL이 복사되었습니다!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default HugiRowList;
