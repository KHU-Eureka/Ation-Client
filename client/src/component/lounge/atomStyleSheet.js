const COLOR1 = '#FE3400'; //포인트
const COLOR2 = '#352C23'; //강조1(블랙)
const COLOR3 = '#FFFFFF'; //강조2(화이트)
const COLOR4 = '#807A74'; //비강조1
const COLOR5 = '#BEBBB9'; //비강조2

const SIZE1 = '26px'; 
const SIZE2 = '24px';
const SIZE3 = '21px'; 
const SIZE4 = '18px'; 
const SIZE5 = '15px'; 
const SIZE6 = '11px'; 

const FONTFAMILY = 'Pretendard';
const FONTSTYLE = 'normal';

const BASIC_FONTSTYLE = {
    fontFamily: FONTFAMILY,
    fontStyle: FONTSTYLE,
    cursor: 'default'
}

export const HEADER_STYLE = {
    ...BASIC_FONTSTYLE,
    fontWeight: 'bold',
    fontSize: SIZE1,
    color: COLOR1,
    marginRight: '11px',
}

export const MAINTITLE_STYLE = {
    ...BASIC_FONTSTYLE,
    fontWeight: 'bold',
    fontSize: SIZE3,
    color: COLOR4,
}

export const MEMBERNUM_STYLE = {
    ...BASIC_FONTSTYLE,
    fontWeight: 500,
    fontSize: SIZE3,
    color: COLOR3,
    marginTop: '19px',
}

export const LEADERNAME_STYLE = {
    ...BASIC_FONTSTYLE,
    fontWeight: 500,
    fontSize: SIZE5,
    color: COLOR3,
}

export const LEADERIMG_STYLE = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    marginLeft: '12px'
}

const BASIC_BTNSTYLE_ENTER = {
    ...BASIC_FONTSTYLE,
    fontWeight: 'bold',
    fontSize: SIZE6,
    width: '52.23px',
    height: '26px',
    boxSizing: 'border-box',
    borderRadius: '50px',
}

export const VALIDBTN_STYLE_ENTER = {
    ...BASIC_BTNSTYLE_ENTER,
    border: `1px solid ${COLOR1}`,
    color: COLOR1,
    background: COLOR3,
    cursor: 'pointer',
}

export const INVALIDBTN_STYLE_ENTER = {
    ...BASIC_BTNSTYLE_ENTER,
    border: `1px solid #E7E6E5`,
    color: COLOR3,
    background: '#E7E6E5',
}

export const DEFAULT_BG_STYLE = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F5F5F5',
    borderRadius: '10px',
}

export const BTN_HOVERSTYLE = {
    background: '#F5F5F5',
}

export const BTN_HOVEROUTSTYLE = {
    background: `${COLOR3}`,
}

export const BTN_CLICKSTYLE = {
    background: `${COLOR1}`,
    color: `${COLOR3}`,
}

export const BTN_CLICKOUTSTYLE = {
    background: `${COLOR3}`,
    color: `${COLOR1}`,
}

export const MODULE_HOVERSTYLE = {
    border: `1px solid ${COLOR5}`,
}

export const MODULE_HOVEROUTSTYLE = {
    border: 'none',
}