import{j as e}from"./jsx-runtime-DKYdS87x.js";import{B as s}from"./button-JvBpyjN2.js";import{r as c}from"./iframe-aXLTpU1b.js";import"./utils-D9emvGTX.js";import"./preload-helper-PPVm8Dsz.js";const E=(...a)=>a.filter((r,t,n)=>!!r&&r.trim()!==""&&n.indexOf(r)===t).join(" ").trim();const W=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();const T=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(r,t,n)=>n?n.toUpperCase():t.toLowerCase());const C=a=>{const r=T(a);return r.charAt(0).toUpperCase()+r.slice(1)};var V={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const X=a=>{for(const r in a)if(r.startsWith("aria-")||r==="role"||r==="title")return!0;return!1};const H=c.forwardRef(({color:a="currentColor",size:r=24,strokeWidth:t=2,absoluteStrokeWidth:n,className:M="",children:o,iconNode:N,...A},O)=>c.createElement("svg",{ref:O,...V,width:r,height:r,stroke:a,strokeWidth:n?Number(t)*24/Number(r):t,className:E("lucide",M),...!o&&!X(A)&&{"aria-hidden":"true"},...A},[...N.map(([P,$])=>c.createElement(P,$)),...Array.isArray(o)?o:[o]]));const I=(a,r)=>{const t=c.forwardRef(({className:n,...M},o)=>c.createElement(H,{ref:o,iconNode:r,className:E(`lucide-${W(C(a))}`,`lucide-${a}`,n),...M}));return t.displayName=C(a),t};const R=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]],U=I("heart",R);const q=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],_=I("mail",q);const F=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],i=I("plus",F);const Z=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],G=I("trash-2",Z),re={title:"UI/Button",component:s,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","destructive","outline","secondary","ghost","link"]},size:{control:"select",options:["default","xs","sm","lg","icon","icon-xs","icon-sm","icon-lg"]},disabled:{control:"boolean"},asChild:{control:"boolean"}}},l={args:{children:"Default Button",variant:"default"}},d={args:{children:"Delete",variant:"destructive"}},u={args:{children:"Outline",variant:"outline"}},m={args:{children:"Secondary",variant:"secondary"}},p={args:{children:"Ghost",variant:"ghost"}},h={args:{children:"Link Button",variant:"link"}},g={args:{children:"Extra Small",size:"xs"}},v={args:{children:"Small",size:"sm"}},x={args:{children:"Default Size",size:"default"}},S={args:{children:"Large",size:"lg"}},f={args:{size:"icon",children:e.jsx(i,{}),"aria-label":"Add"}},z={args:{size:"icon-xs",children:e.jsx(U,{}),"aria-label":"Like"}},B={args:{size:"icon-sm",children:e.jsx(G,{}),variant:"destructive","aria-label":"Delete"}},D={args:{size:"icon-lg",children:e.jsx(_,{}),variant:"outline","aria-label":"Email"}},j={args:{children:e.jsxs(e.Fragment,{children:[e.jsx(_,{}),"Send Email"]})}},y={args:{variant:"destructive",children:e.jsxs(e.Fragment,{children:[e.jsx(G,{}),"Delete Item"]})}},b={args:{children:"Disabled",disabled:!0}},k={args:{children:"Disabled Destructive",variant:"destructive",disabled:!0}},L={render:()=>e.jsxs("div",{className:"flex flex-wrap items-center gap-4",children:[e.jsx(s,{variant:"default",children:"Default"}),e.jsx(s,{variant:"destructive",children:"Destructive"}),e.jsx(s,{variant:"outline",children:"Outline"}),e.jsx(s,{variant:"secondary",children:"Secondary"}),e.jsx(s,{variant:"ghost",children:"Ghost"}),e.jsx(s,{variant:"link",children:"Link"})]})},w={render:()=>e.jsxs("div",{className:"flex flex-wrap items-center gap-4",children:[e.jsx(s,{size:"xs",children:"Extra Small"}),e.jsx(s,{size:"sm",children:"Small"}),e.jsx(s,{size:"default",children:"Default"}),e.jsx(s,{size:"lg",children:"Large"}),e.jsx(s,{size:"icon-xs",children:e.jsx(i,{})}),e.jsx(s,{size:"icon-sm",children:e.jsx(i,{})}),e.jsx(s,{size:"icon",children:e.jsx(i,{})}),e.jsx(s,{size:"icon-lg",children:e.jsx(i,{})})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Default Button',
    variant: 'default'
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Delete',
    variant: 'destructive'
  }
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Outline',
    variant: 'outline'
  }
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Secondary',
    variant: 'secondary'
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Ghost',
    variant: 'ghost'
  }
}`,...p.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Link Button',
    variant: 'link'
  }
}`,...h.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Extra Small',
    size: 'xs'
  }
}`,...g.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Small',
    size: 'sm'
  }
}`,...v.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Default Size',
    size: 'default'
  }
}`,...x.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Large',
    size: 'lg'
  }
}`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'icon',
    children: <Plus />,
    'aria-label': 'Add'
  }
}`,...f.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'icon-xs',
    children: <Heart />,
    'aria-label': 'Like'
  }
}`,...z.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'icon-sm',
    children: <Trash2 />,
    variant: 'destructive',
    'aria-label': 'Delete'
  }
}`,...B.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'icon-lg',
    children: <Mail />,
    variant: 'outline',
    'aria-label': 'Email'
  }
}`,...D.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
                <Mail />
                Send Email
            </>
  }
}`,...j.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'destructive',
    children: <>
                <Trash2 />
                Delete Item
            </>
  }
}`,...y.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Disabled',
    disabled: true
  }
}`,...b.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Disabled Destructive',
    variant: 'destructive',
    disabled: true
  }
}`,...k.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
        </div>
}`,...L.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-4">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon-xs">
                <Plus />
            </Button>
            <Button size="icon-sm">
                <Plus />
            </Button>
            <Button size="icon">
                <Plus />
            </Button>
            <Button size="icon-lg">
                <Plus />
            </Button>
        </div>
}`,...w.parameters?.docs?.source}}};const ae=["Default","Destructive","Outline","Secondary","Ghost","Link","SizeXS","SizeSM","SizeDefault","SizeLG","IconButton","IconButtonXS","IconButtonSM","IconButtonLG","WithIcon","DestructiveWithIcon","Disabled","DisabledDestructive","AllVariants","AllSizes"];export{w as AllSizes,L as AllVariants,l as Default,d as Destructive,y as DestructiveWithIcon,b as Disabled,k as DisabledDestructive,p as Ghost,f as IconButton,D as IconButtonLG,B as IconButtonSM,z as IconButtonXS,h as Link,u as Outline,m as Secondary,x as SizeDefault,S as SizeLG,v as SizeSM,g as SizeXS,j as WithIcon,ae as __namedExportsOrder,re as default};
