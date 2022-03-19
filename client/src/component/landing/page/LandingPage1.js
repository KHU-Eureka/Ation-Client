import { ReactComponent as Logo } from '../../../assets/svg/logo.svg';

function LandingPage1 () {

    return (
        <div className="page1">
            <Logo className="logo sa sa-down" id="page1Logo" data-sa-margin="300"/>
            <div className="title-description sa sa-down"
            data-sa-trigger="#page1Logo" data-sa-margin="600">
                ation은 창작가들이 아이데이션 하기 위한 모든 수단을 제공합니다. <br/>
                영감을 얻을 수 있는 콘텐츠를 확인하고, 사람들과 소통을 통해 인사이트를 얻어보세요. <br/>
                오늘 떠올랐던 아이디어를 비밀스럽게 적어놓을 수도 있습니다.
            </div>
        </div>
    )
}
export default LandingPage1;