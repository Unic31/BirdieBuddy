import React from 'react';
import './MypageModal.css';

function MypageUpdateNickname(props) {
    const { open, close, header, changeCon } = props;

    return (
        // 모달이 열릴때 openModal 클래스가 생성된다.
        <div className={open ? 'openModal modal' : 'modal'}>
            {open ? (
                <section>
                    <header>
                        {header}
                        <button onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main>{props.children}</main>
                    <footer>
                        <button onClick={changeCon}>
                            저장
                        </button>
                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default MypageUpdateNickname;
