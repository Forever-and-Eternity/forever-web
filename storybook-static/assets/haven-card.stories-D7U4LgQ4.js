import{j as e}from"./jsx-runtime-DKYdS87x.js";import{L as g}from"./link-4p1hHhU6.js";import{C as h,a as f,b,d as C}from"./card-Djt3dkeB.js";import{S as x,c as y,a as H}from"./utils-D9emvGTX.js";import"./iframe-aXLTpU1b.js";import"./preload-helper-PPVm8Dsz.js";const j=H("inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",ghost:"[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",link:"text-primary underline-offset-4 [a&]:hover:underline"}},defaultVariants:{variant:"default"}});function m({className:n,variant:u="default",asChild:p=!1,...l}){const v=p?x:"span";return e.jsx(v,{"data-slot":"badge","data-variant":u,className:y(j({variant:u}),n),...l})}m.__docgenInfo={description:"",methods:[],displayName:"Badge",props:{asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},variant:{defaultValue:{value:"'default'",computed:!1},required:!1}}};function a({haven:n}){return e.jsx(g,{href:`/havens/${n.id}`,children:e.jsxs(h,{className:"group transition-all hover:shadow-lg hover:-translate-y-0.5",children:[e.jsx(f,{className:"pb-2",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-ig text-sm font-bold text-white shrink-0",children:n.name.charAt(0).toUpperCase()}),e.jsx(b,{className:"text-lg group-hover:text-gradient-warm transition-colors",children:n.name})]})}),e.jsxs(C,{children:[n.description&&e.jsx("p",{className:"mb-3 text-sm text-muted-foreground leading-relaxed line-clamp-2",children:n.description}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(m,{variant:"secondary",className:"font-normal",children:[n.contentCount," items"]}),e.jsxs(m,{variant:"outline",className:"font-normal",children:[n.memberCount," members"]})]})]})]})})}a.__docgenInfo={description:"",methods:[],displayName:"HavenCard",props:{haven:{required:!0,tsType:{name:"Haven"},description:""}}};const r={id:"1",name:"Family Memories",description:"A collection of our favorite family moments, photos, and stories from over the years.",ownerId:"user-1",ownerDisplayName:"Jane Doe",memberCount:5,contentCount:42,createdAt:"2024-01-15T10:30:00Z"},W={title:"Havens/HavenCard",component:a,parameters:{layout:"centered",nextjs:{appDirectory:!0}},tags:["autodocs"],decorators:[n=>e.jsx("div",{className:"w-[360px] p-4",children:e.jsx(n,{})})]},t={args:{haven:r}},s={args:{haven:{...r,id:"2",name:"Summer Vacation 2024",description:"Photos and videos from our amazing trip to the coast. We visited three different beaches, went snorkeling, and had the most incredible sunsets every evening. This was truly a trip to remember forever.",contentCount:128,memberCount:8}}},o={args:{haven:{...r,id:"3",name:"Quick Captures",description:void 0,contentCount:7,memberCount:1}}},i={args:{haven:{...r,id:"4",name:"New Haven",description:"Just getting started!",contentCount:0,memberCount:1}}},d={args:{haven:{...r,id:"5",name:"Grandpa's Archive",description:"Decades of family history, documents, and photographs lovingly preserved.",contentCount:2847,memberCount:23}}},c={args:{haven:r},decorators:[()=>e.jsxs("div",{className:"grid w-[800px] grid-cols-2 gap-4 p-4",children:[e.jsx(a,{haven:r}),e.jsx(a,{haven:{...r,id:"2",name:"Summer Vacation 2024",description:"Photos from the beach trip",contentCount:128,memberCount:8}}),e.jsx(a,{haven:{...r,id:"3",name:"Quick Captures",description:void 0,contentCount:7,memberCount:1}}),e.jsx(a,{haven:{...r,id:"4",name:"Wedding Album",description:"Our special day captured in beautiful moments",contentCount:350,memberCount:12}})]})]};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    haven: baseHaven
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    haven: {
      ...baseHaven,
      id: '2',
      name: 'Summer Vacation 2024',
      description: 'Photos and videos from our amazing trip to the coast. We visited three different beaches, went snorkeling, and had the most incredible sunsets every evening. This was truly a trip to remember forever.',
      contentCount: 128,
      memberCount: 8
    }
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    haven: {
      ...baseHaven,
      id: '3',
      name: 'Quick Captures',
      description: undefined,
      contentCount: 7,
      memberCount: 1
    }
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    haven: {
      ...baseHaven,
      id: '4',
      name: 'New Haven',
      description: 'Just getting started!',
      contentCount: 0,
      memberCount: 1
    }
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    haven: {
      ...baseHaven,
      id: '5',
      name: 'Grandpa\\'s Archive',
      description: 'Decades of family history, documents, and photographs lovingly preserved.',
      contentCount: 2847,
      memberCount: 23
    }
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    haven: baseHaven
  },
  decorators: [() => <div className="grid w-[800px] grid-cols-2 gap-4 p-4">
                <HavenCard haven={baseHaven} />
                <HavenCard haven={{
      ...baseHaven,
      id: '2',
      name: 'Summer Vacation 2024',
      description: 'Photos from the beach trip',
      contentCount: 128,
      memberCount: 8
    }} />
                <HavenCard haven={{
      ...baseHaven,
      id: '3',
      name: 'Quick Captures',
      description: undefined,
      contentCount: 7,
      memberCount: 1
    }} />
                <HavenCard haven={{
      ...baseHaven,
      id: '4',
      name: 'Wedding Album',
      description: 'Our special day captured in beautiful moments',
      contentCount: 350,
      memberCount: 12
    }} />
            </div>]
}`,...c.parameters?.docs?.source}}};const A=["Default","WithLongDescription","WithoutDescription","EmptyHaven","LargeCollection","CardGrid"];export{c as CardGrid,t as Default,i as EmptyHaven,d as LargeCollection,s as WithLongDescription,o as WithoutDescription,A as __namedExportsOrder,W as default};
