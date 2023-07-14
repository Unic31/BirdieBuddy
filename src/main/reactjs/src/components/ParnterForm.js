import "./PartenerForm.css";
const PartnerForm = ({ onClose }) => {
    return (
        <div className="partnerform">
            <div className="PFdiv">동반자 정보입력</div>

            <div className="PFradio">
                <div className="PFdiv1">성별</div>
                <div className="PFdiv2">
                    <div className="PFradio-with-label">
                        <input type={"radio"} name={"PFgender"} className="PFradio1"/>
                        <div className="PFdiv3">남자</div>
                    </div>
                    <div className="PFradio-with-label">
                        <input type={"radio"} name={"PFgender"} className="PFradio1"/>
                        <div className="PFdiv3">여자</div>
                    </div>
                </div>
            </div>
            <div className="PFframe">
                <div className="PFtasu">
                    <div className="PFdiv1">타수</div>
                    <div className="PFtext-field">
                        <input type="number" className="PFinfo1" placeholder={"타수 숫자로 입력"}/>
                    </div>
                </div>
                <div className="PFage">
                    <div className="PFdiv1">나이</div>
                    <div className="PFtext-field">
                        <input type="number" className="PFinfo1" placeholder={"나이 숫자로 입력"}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerForm;