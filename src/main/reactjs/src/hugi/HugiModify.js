import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import Button from '@mui/material/Button';
import {useNavigate, useParams} from "react-router-dom";
import "./Hugi.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
function HugiModify(props) {
    const { hnum } = useParams();
    // const [hnum,setHnum]=useState('');
    const [unum, setUnum] = useState('');
    const [hlike, setHlike] = useState('');
    const [hphoto, setHphoto] = useState('');
    const [hcontent, setHcontent] = useState('');
    const [postUserNickname, setPostUserNickname] = useState('');
    const [hwriteday, setHwriteday] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');

    const navi = useNavigate();

    const unumchk=()=>{
        Axios.get("/apilogin/unumChk")
            .then(res=> {
                setUnum(res.data);
            });
    }
    useEffect(() => {
        unumchk()
    }, [])
    // 파일 업로드 이벤트 핸들러 (async/await 사용)
    const onUploadEvent = async (e) => {
        const uploadFile = new FormData();
        uploadFile.append('upload', e.target.files[0]);
        try {
            const res = await Axios.post('/apihugi/upload', uploadFile);
            setHphoto(res.data);
        } catch (error) {
            // console.log(error);
        }
    };

// 파일 선택 시 파일명 업데이트 함수
    const onFileChange = (e) => {
        const fileName = e.target.value.split('\\').pop(); // 파일명 추출
        setSelectedFileName(fileName); // 파일명 상태 업데이트
    };

    // 수정 폼 제출 이벤트 핸들러 (async/await 사용)
    const onSubmitEdit = async (e) => {
        const currentDate = new Date();
        const offset = 1000 * 60 * 60 * 9
        const koreaNow = new Date((new Date()).getTime() + offset)
        const formattedDate = koreaNow.toISOString().slice(0, 19).replace('T', ' ');

        e.preventDefault();

        const dataToUpdate = {
            hnum: hnum,
            unum: unum,
            hlike: hlike,
            unickname: postUserNickname,
            hcontent: hcontent,
            hphoto: hphoto,
            hwriteday:formattedDate,
        };

        // console.log('modifyData>>', dataToUpdate);
        try {
            await Axios.post('/apihugi/update', dataToUpdate);
            navi('/hugi/list');
        } catch (error) {
            // console.log(error);
        }
    };
    const handleClcikList = () => {
        navi('/hugi/list');
    }
    // 수정 폼이 로드될 때 원래 사진과 내용을 보여주기 위해 useEffect를 사용합니다.
    // 해당 게시물의 데이터를 불러오기 위한 useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(`/apihugi/detail/${hnum}`);
                const data = response.data; // 서버로부터 받은 데이터
                setHlike(data.hlike);
                setHphoto(data.hphoto);
                setHcontent(data.hcontent);
                setPostUserNickname(data.postUserNickname);
                setHwriteday(data.hwriteday);
            } catch (error) {
                // console.log(error);
            }
        };

        fetchData();
    }, [hnum]);

    return (
        <div>
        <Header/>
        <div style={{ border: '0px solid gray', width: '100%', height:'100%',margin:'100px auto',textAlign:"center",padding:"10px"}}>
            {/* 이미지 미리보기 */}
            {hphoto &&
                <img alt="" src={`${process.env.REACT_APP_HUGI2}${hphoto}${process.env.REACT_APP_HUGI_325}`} value={hphoto}/>}
            <br/><br/>
            <div className="filebox">
                <input className="upload-name" style={{width:"78%"}} value={selectedFileName || "첨부파일"} placeholder="첨부파일" readOnly />
                <label htmlFor="file" style={{textAlign:"center",padding:"10px",fontSize:"13px",width:"22%"}}>파일찾기</label>
                <input type="file" id="file" onChange={(e) => { onUploadEvent(e); onFileChange(e); }} />
            </div>
           <br/>
            <div className="input-group">
                {/* 기존 후기 내용 */}
                <textarea className="form-control" style={{ width: '60%',height:'80px', resize: 'none',fontSize:'12px'}} value={hcontent} onChange={(e) => setHcontent(e.target.value)} >{hcontent}</textarea>
                {/* 파일 업로드 */}
                <br />
                {/* 수정 취소 및 수정 제출 버튼 */}
                <button type="submit" className="HG_modify" style={{width:"22%" ,padding:"10px",fontSize:"13px"}} onClick={onSubmitEdit}>
                    수정하기
                </button>
            </div><br/>
                <button type="button" className="HG_modify"style={{width:"50px",height:"30px",marginRight:"10px",fontSize:"13px"}} autoFocus onClick={handleClcikList}>
                    취소
                </button>
        </div>
        </div>
    );
}

export default HugiModify;
