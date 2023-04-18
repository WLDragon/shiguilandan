import { Application } from "pixi.js";


let assets: string = 'age.png,bg1.png,bg2.png,bg3.png,bg4.png,bg5.png,btn1.png,btn3.png,btn4.png,btn5.png,btn6.png,btn7.png,btn8.png,btn9.png,close1.png,close2.png,close3.png,dark.png,dialog.png,e001.png,e002.png,e003.png,e004.png,e005.png,e006.png,e007.png,equipBg.png,finger.png,g1001.png,g1002.png,g1003.png,g1004.png,g1005.png,g1006.png,g1007.png,g1008.png,g1009.png,g2001.png,g2002.png,g2003.png,g2004.png,g2005.png,g2006.png,g2007.png,g2008.png,g2009.png,g3001.png,g3002.png,g3003.png,g3004.png,g3005.png,g3006.png,g3007.png,g4001.png,g4002.png,g4003.png,g4004.png,g4005.png,g4006.png,g4007.png,g4008.png,g4009.png,g4010.png,g5001.png,g5002.png,g5003.png,g5004.png,g5005.png,g5006.png,g5007.png,g5008.png,g5009.png,g5010.png,g5011.png,g5012.png,g5013.png,gem.png,goodsBg1.png,goodsBg2.png,goodsTab.png,h001.png,h002.png,h003.png,h005.png,h006.png,h007.png,h008.png,h009.png,h010.png,h011.png,h012.png,h013.png,h014.png,h015.png,h016.png,h017.png,h018.png,h019.png,h020.png,h021.png,h022.png,h023.png,h024.png,h025.png,h026.png,h027.png,h028.png,h029.png,h030.png,h031.png,h032.png,heroBg.png,heroTab.png,ico_home.png,ico_key.png,ico_music1.png,ico_music2.png,ico_rocker.png,ico_save.png,ico_setting.png,ico_sound1.png,ico_sound2.png,ico_tri.png,keyboard.png,lock.png,m0.png,m1.png,m2.png,m3.png,m4.png,m5.png,m6.png,m7.png,m8.png,m9.png,n0.png,n1.png,n2.png,n3.png,n4.png,n5.png,n6.png,n7.png,n8.png,n9.png,recordBg.png,rocker1.png,rocker2.png,rootBg.png,shadow.png,shadow1.png,shadow2.png,slider1.png,slider2.png,slider3.png,title.png,z001.png,z002.png,z003.png,z004.png,z005.png,z006.png,z007.png,z008.png,z009.png,z010.png,z011.png,z012.png,z013.png,z014.png,z015.png,z016.png,z017.png,z018.png,z019.png,z020.png,z021.png,z022.png,z023.png,z024.png,z025.png,z026.png,z027.png,z028.png,z029.png,z030.png,z031.png,z032.png,z033.png,z034.png,z035.png,z036.png,z037.png,z038.png';

/**
 * 这个文件使用 npm run image 生成，不要修改
 */
export function debugLoadImages(application: Application) {
  let a = assets.split(',')
  let b = application.loader
  a.forEach(path => {
    let name = path.includes('avatar/') ? path.substring(7) : path
    b.add(name, '../_assist/images/' + path)
  })
}