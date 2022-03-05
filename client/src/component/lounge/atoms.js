import { HEADER_STYLE, MAINTITLE_STYLE } from './atomStyleSheet';

const btn = () => {

}

const title = (title) => {
    return(
        <span>
            {title}
        </span>
    );
}

const member = (memberNum, limitNum) => {
    return(
        <span>
            {`${memberNum}/${limitNum}`}
        </span>
    );
}

const tag = (mainCategory, subCategoryList) => {
    return(
        <>
        <span>
            {`#${mainCategory}`}
        </span>
        {subCategoryList.map( tag => 
        <span>{tag}</span>    
        )}
        </>
    );
}

const site = (siteName, logo) => {
    return(
        <>
            <span>{siteName}</span>
            <img src={logo} />
        </>
    );
}

export const mainTitle = (title, header) => {
    return(
        <header className="title-container" style={{marginLeft: '0px', marginBottom: '20px'}}>
            {header?<span style={HEADER_STYLE}>{header}</span>:null}
            <span style={MAINTITLE_STYLE}>{title}</span>
        </header>
    );
}

export const imgBox = (obj) => {
    return(
        <div>
            <div>
                {title(obj.title)}
                {member(obj.totalMember,obj.limitMember )}
            </div>
            <div>
                {tag(obj.mainCategory, obj.subCategoryList)}
                {site(obj)}
            </div>
        </div>
    );
}