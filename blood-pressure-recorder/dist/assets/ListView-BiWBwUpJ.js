import{a as w,d,r as k,b as r,o as _,c as f,w as l,e as t,f as m,u as B,E as n,g as C,h as y,i as u}from"./index-hKxIlbTa.js";function v(i,a){return w.delete(`/records/${i.id}`,a)}const L=d({__name:"BloodPressureList",setup(i){const a=k([]);function c(){C({count:0},u).then(o=>{o.data.forEach(e=>{e.timestamp=e.time,e.time=new Date(e.time).toLocaleString()}),o.data.reverse(),a.value=o.data})}c();const h=s=>{y.confirm("确定删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{console.log(s);let o={id:s.timestamp};v(o,u).then(e=>{console.log(e),e.status===200?(c(),n.success("删除成功")):n.error("删除失败")}).catch(e=>{console.log(e),n.error("删除失败")})}).catch(()=>{n.info("已取消删除")})};return(s,o)=>{const e=r("el-table-column"),p=r("el-button"),g=r("el-table");return _(),f(g,{data:a.value,stripe:"true",size:"small"},{default:l(()=>[t(e,{prop:"high",label:"上压","min-width":"40px"}),t(e,{prop:"low",label:"下压","min-width":"40px"}),t(e,{prop:"heartRate",label:"心率","min-width":"40px"}),t(e,{prop:"time",label:"Time"}),t(e,{prop:"location",label:"位置","min-width":"40px"}),t(e,{prop:"remark",label:"备注"}),t(e,{fixed:"right",label:"Operations"},{default:l(({row:x})=>[t(p,{link:"",type:"danger",onClick:b=>h(x)},{default:l(()=>[m(" 删除 ")]),_:2},1032,["onClick"]),t(p,{link:"",type:"primary",onClick:o[0]||(o[0]=b=>B(n).success("man! what can I say"))},{default:l(()=>[m(" 修改 ")]),_:1})]),_:1})]),_:1},8,["data"])}}}),R=d({__name:"ListView",setup(i){return(a,c)=>(_(),f(L))}});export{R as default};
