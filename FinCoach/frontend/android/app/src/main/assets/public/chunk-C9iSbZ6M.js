import {F,K as Ke,G as Ge$1}from'./chunk-BuIVQgaV.js';import {y}from'./chunk-C9t6p4bX.js';import {B as Bt,O as Ot,m as mi,z as ze$1,y as yt,f as fi,a as Pe,v as vt}from'./chunk-C_0JF5jc.js';import {y as h,z as zU,T as Td,g as ut$1,Z as Z3,q as q3,W as WU,A as GU,i as qy,S as SM,H as HU,B as UU,F as FM,O as OM,U as Us,Q as Qw,K as Ku,G as Gn,m as mg,s as rI,C as uw,t as Qs,w as hg,x as iI,D as dw,E as fe,J as se,L as Ua,M as rd,P as re,R as nS,V as Zd,X as lt$1,Y as Kt,_ as GM,$ as g,a0 as $r,a1 as G,a2 as de,a3 as bb,a4 as Sb,a5 as $f,a6 as Db,a7 as ee,a8 as mt$1,a9 as ce,aa as CM,ab as $g,ac as mc,ad as uc,ae as Cv,af as Wd,ag as qe,ah as It,ai as Tt,aj as Xg,ak as ia,al as ra,am as Op,an as dg,ao as xw,ap as Bn,aq as oa,ar as dt$1,as as We$1,at as Eg,au as Mw,av as Sw,aw as _g,ax as ii,ay as Fv,az as LM,aA as Nn,aB as m3,aC as zn,aD as bg,aE as jv,aF as ft$1,aG as L,aH as B,aI as Ge$2,aJ as _b,aK as P,aL as Y,aM as $,aN as X,aO as Cr,aP as Ar,aQ as Ab,aR as ww,aS as Og,aT as Xu,aU as yw,aV as Qu,aW as $t,aX as sy,aY as gl,aZ as ie$1,a_ as O,a$ as Jr,b0 as Qt,b1 as V8,b2 as Cu,b3 as l,b4 as m,b5 as X8,b6 as x$,b7 as Pn,b8 as ey,b9 as P8,ba as lw,bb as bp,bc as Dp}from'./main-GJ3XQ3JC.js';var ve=class{_multiple;_emitChanges;compareWith;_selection=new Set;_deselectedToEmit=[];_selectedToEmit=[];_selected=null;get selected(){return this._selected||(this._selected=Array.from(this._selection.values())),this._selected}changed=new G;bulk={select:t=>this._select(t),deselect:t=>this._deselect(t),setSelection:t=>this._setSelection(t)};constructor(t=false,e,i=true,n){this._multiple=t,this._emitChanges=i,this.compareWith=n,e&&e.length&&(t?e.forEach(r=>this._markSelected(r)):this._markSelected(e[0]),this._selectedToEmit.length=0);}select(...t){return this._select(t)}deselect(...t){return this._deselect(t)}setSelection(...t){return this._setSelection(t)}toggle(t){return this.isSelected(t)?this.deselect(t):this.select(t)}clear(t=true){this._unmarkAll();let e=this._hasQueuedChanges();return t&&this._emitChangeEvent(),e}isSelected(t){return this._selection.has(this._getConcreteValue(t))}isEmpty(){return this._selection.size===0}hasValue(){return !this.isEmpty()}sort(t){this._multiple&&this.selected&&this._selected.sort(t);}isMultipleSelection(){return this._multiple}_select(t){this._verifyValueAssignment(t),t.forEach(i=>this._markSelected(i));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_deselect(t){this._verifyValueAssignment(t),t.forEach(i=>this._unmarkSelected(i));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_setSelection(t){this._verifyValueAssignment(t);let e=this.selected,i=new Set(t.map(r=>this._getConcreteValue(r)));t.forEach(r=>this._markSelected(r)),e.filter(r=>!i.has(this._getConcreteValue(r,i))).forEach(r=>this._unmarkSelected(r));let n=this._hasQueuedChanges();return this._emitChangeEvent(),n}_emitChangeEvent(){this._selected=null,(this._selectedToEmit.length||this._deselectedToEmit.length)&&(this.changed.next({source:this,added:this._selectedToEmit,removed:this._deselectedToEmit}),this._deselectedToEmit=[],this._selectedToEmit=[]);}_markSelected(t){t=this._getConcreteValue(t),this.isSelected(t)||(this._multiple||this._unmarkAll(),this.isSelected(t)||this._selection.add(t),this._emitChanges&&this._selectedToEmit.push(t));}_unmarkSelected(t){t=this._getConcreteValue(t),this.isSelected(t)&&(this._selection.delete(t),this._emitChanges&&this._deselectedToEmit.push(t));}_unmarkAll(){this.isEmpty()||this._selection.forEach(t=>this._unmarkSelected(t));}_verifyValueAssignment(t){t.length>1&&this._multiple;}_hasQueuedChanges(){return !!(this._deselectedToEmit.length||this._selectedToEmit.length)}_getConcreteValue(t,e){if(this.compareWith){e=e??this._selection;for(let i of e)if(this.compareWith(t,i))return i;return t}else return t}};var en=20,tt=(()=>{class o{_ngZone=h(B);_platform=h(ft$1);_renderer=h(Ge$2).createRenderer(null,null);_cleanupGlobalListener;_scrolled=new G;_scrolledCount=0;scrollContainers=new Map;register(e){this.scrollContainers.has(e)||this.scrollContainers.set(e,e.elementScrolled().subscribe(()=>this._scrolled.next(e)));}deregister(e){let i=this.scrollContainers.get(e);i&&(i.unsubscribe(),this.scrollContainers.delete(e));}scrolled(e=en){return this._platform.isBrowser?new O(i=>{this._cleanupGlobalListener||(this._cleanupGlobalListener=this._ngZone.runOutsideAngular(()=>this._renderer.listen("document","scroll",()=>this._scrolled.next())));let n=e>0?this._scrolled.pipe(_b(e)).subscribe(i):this._scrolled.subscribe(i);return this._scrolledCount++,()=>{n.unsubscribe(),this._scrolledCount--,this._scrolledCount||(this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0);}}):Jr()}ngOnDestroy(){this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0,this.scrollContainers.forEach((e,i)=>this.deregister(i)),this._scrolled.complete();}ancestorScrolled(e,i){let n=this.getAncestorScrollContainers(e);return this.scrolled(i).pipe(mt$1(r=>!r||n.indexOf(r)>-1))}getAncestorScrollContainers(e){let i=[];return this.scrollContainers.forEach((n,r)=>{this._targetContainsElement(r,e)&&i.push(r);}),i}_targetContainsElement(e,i){let n=Qt(i),r=e.getElementRef().nativeElement;do if(n==r)return  true;while(n=n.parentElement);return  false}static \u0275fac=function(i){return new(i||o)};static \u0275prov=P({token:o,factory:o.\u0275fac})}return o})();var tn=20,te=(()=>{class o{_platform=h(ft$1);_listeners;_viewportSize=null;_change=new G;_document=h(L);constructor(){let e=h(B),i=h(Ge$2).createRenderer(null,null);e.runOutsideAngular(()=>{if(this._platform.isBrowser){let n=r=>this._change.next(r);this._listeners=[i.listen("window","resize",n),i.listen("window","orientationchange",n)];}this.change().subscribe(()=>this._viewportSize=null);});}ngOnDestroy(){this._listeners?.forEach(e=>e()),this._change.complete();}getViewportSize(){this._viewportSize||this._updateViewportSize();let e={width:this._viewportSize.width,height:this._viewportSize.height};return this._platform.isBrowser||(this._viewportSize=null),e}getViewportRect(){let e=this.getViewportScrollPosition(),{width:i,height:n}=this.getViewportSize();return {top:e.top,left:e.left,bottom:e.top+n,right:e.left+i,height:n,width:i}}getViewportScrollPosition(){if(!this._platform.isBrowser)return {top:0,left:0};let e=this._document,i=this._getWindow(),n=e.documentElement,r=n.getBoundingClientRect(),s=-r.top||e.body?.scrollTop||i.scrollY||n.scrollTop||0,l=-r.left||e.body?.scrollLeft||i.scrollX||n.scrollLeft||0;return {top:s,left:l}}change(e=tn){return e>0?this._change.pipe(_b(e)):this._change}_getWindow(){return this._document.defaultView||window}_updateViewportSize(){let e=this._getWindow();this._viewportSize=this._platform.isBrowser?{width:e.innerWidth,height:e.innerHeight}:{width:0,height:0};}static \u0275fac=function(i){return new(i||o)};static \u0275prov=P({token:o,factory:o.\u0275fac})}return o})();var Be=(()=>{class o{static \u0275fac=function(i){return new(i||o)};static \u0275mod=fe({type:o});static \u0275inj=se({})}return o})(),it=(()=>{class o{static \u0275fac=function(i){return new(i||o)};static \u0275mod=fe({type:o});static \u0275inj=se({imports:[Ua,Be,Ua,Be]})}return o})();var ye=class{_attachedHost=null;attach(t){return this._attachedHost=t,t.attach(this)}detach(){let t=this._attachedHost;t!=null&&(this._attachedHost=null,t.detach());}get isAttached(){return this._attachedHost!=null}setAttachedHost(t){this._attachedHost=t;}},nt=class extends ye{component;viewContainerRef;injector;projectableNodes;bindings;directives;constructor(t,e,i,n,r,s){super(),this.component=t,this.viewContainerRef=e,this.injector=i,this.projectableNodes=n,this.bindings=r||null,this.directives=s||null;}},be=class extends ye{templateRef;viewContainerRef;context;injector;constructor(t,e,i,n){super(),this.templateRef=t,this.viewContainerRef=e,this.context=i,this.injector=n;}get origin(){return this.templateRef.elementRef}attach(t,e=this.context){return this.context=e,super.attach(t)}detach(){return this.context=void 0,super.detach()}},ot=class extends ye{element;constructor(t){super(),this.element=t instanceof re?t.nativeElement:t;}},rt=class{_attachedPortal=null;_disposeFn=null;_isDisposed=false;hasAttached(){return !!this._attachedPortal}attach(t){if(t instanceof nt)return this._attachedPortal=t,this.attachComponentPortal(t);if(t instanceof be)return this._attachedPortal=t,this.attachTemplatePortal(t);if(this.attachDomPortal&&t instanceof ot)return this._attachedPortal=t,this.attachDomPortal(t)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn();}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=true;}setDisposeFn(t){this._disposeFn=t;}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null);}},Ne=class extends rt{outletElement;_appRef;_defaultInjector;constructor(t,e,i){super(),this.outletElement=t,this._appRef=e,this._defaultInjector=i;}attachComponentPortal(t){let e;if(t.viewContainerRef){let i=t.injector||t.viewContainerRef.injector,n=i.get(Pn,null,{optional:true})||void 0;e=t.viewContainerRef.createComponent(t.component,{index:t.viewContainerRef.length,injector:i,ngModuleRef:n,projectableNodes:t.projectableNodes||void 0,bindings:t.bindings||void 0,directives:t.directives||void 0}),this.setDisposeFn(()=>e.destroy());}else {let i=this._appRef,n=t.injector||this._defaultInjector||Y.NULL,r=n.get(ie$1,i.injector);e=ey(t.component,{elementInjector:n,environmentInjector:r,projectableNodes:t.projectableNodes||void 0,bindings:t.bindings||void 0,directives:t.directives||void 0}),i.attachView(e.hostView),this.setDisposeFn(()=>{i.viewCount>0&&i.detachView(e.hostView),e.destroy();});}return this.outletElement.appendChild(this._getComponentRootNode(e)),this._attachedPortal=t,e}attachTemplatePortal(t){let e=t.viewContainerRef,i=e.createEmbeddedView(t.templateRef,t.context,{injector:t.injector});return i.rootNodes.forEach(n=>this.outletElement.appendChild(n)),i.detectChanges(),this.setDisposeFn(()=>{let n=e.indexOf(i);n!==-1&&e.remove(n);}),this._attachedPortal=t,i}attachDomPortal=t=>{let e=t.element;e.parentNode;let i=this.outletElement.ownerDocument.createComment("dom-portal");e.parentNode.insertBefore(i,e),this.outletElement.appendChild(e),this._attachedPortal=t,super.setDisposeFn(()=>{i.parentNode&&i.parentNode.replaceChild(e,i);});};dispose(){super.dispose(),this.outletElement.remove();}_getComponentRootNode(t){return t.hostView.rootNodes[0]}};var bi=(()=>{class o{static \u0275fac=function(i){return new(i||o)};static \u0275mod=fe({type:o});static \u0275inj=se({})}return o})();var Ci=P8();function Di(o){return new Le(o.get(te),o.get(L))}var Le=class{_viewportRuler;_previousHTMLStyles={top:"",left:""};_previousScrollPosition;_isEnabled=false;_document;constructor(t,e){this._viewportRuler=t,this._document=e;}attach(){}enable(){if(this._canBeEnabled()){let t=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=t.style.left||"",this._previousHTMLStyles.top=t.style.top||"",t.style.left=X8(-this._previousScrollPosition.left),t.style.top=X8(-this._previousScrollPosition.top),t.classList.add("cdk-global-scrollblock"),this._isEnabled=true;}}disable(){if(this._isEnabled){let t=this._document.documentElement,e=this._document.body,i=t.style,n=e.style,r=i.scrollBehavior||"",s=n.scrollBehavior||"";this._isEnabled=false,i.left=this._previousHTMLStyles.left,i.top=this._previousHTMLStyles.top,t.classList.remove("cdk-global-scrollblock"),Ci&&(i.scrollBehavior=n.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),Ci&&(i.scrollBehavior=r,n.scrollBehavior=s);}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return  false;let e=this._document.documentElement,i=this._viewportRuler.getViewportSize();return e.scrollHeight>i.height||e.scrollWidth>i.width}};function Mi(o,t){return new ze(o.get(tt),o.get(B),o.get(te),t)}var ze=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(t,e,i,n){this._scrollDispatcher=t,this._ngZone=e,this._viewportRuler=i,this._config=n;}attach(t){this._overlayRef,this._overlayRef=t;}enable(){if(this._scrollSubscription)return;let t=this._scrollDispatcher.scrolled(0).pipe(mt$1(e=>!e||!this._overlayRef.overlayElement.contains(e.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=t.subscribe(()=>{let e=this._viewportRuler.getViewportScrollPosition().top;Math.abs(e-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition();})):this._scrollSubscription=t.subscribe(this._detach);}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null);}detach(){this.disable(),this._overlayRef=null;}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach());}};var Ce=class{enable(){}disable(){}attach(){}};function st(o,t){return t.some(e=>{let i=o.bottom<e.top,n=o.top>e.bottom,r=o.right<e.left,s=o.left>e.right;return i||n||r||s})}function wi(o,t){return t.some(e=>{let i=o.top<e.top,n=o.bottom>e.bottom,r=o.left<e.left,s=o.right>e.right;return i||n||r||s})}function Se(o,t){return new We(o.get(tt),o.get(te),o.get(B),t)}var We=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(t,e,i,n){this._scrollDispatcher=t,this._viewportRuler=e,this._ngZone=i,this._config=n;}attach(t){this._overlayRef,this._overlayRef=t;}enable(){if(!this._scrollSubscription){let t=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(t).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let e=this._overlayRef.overlayElement.getBoundingClientRect(),{width:i,height:n}=this._viewportRuler.getViewportSize();st(e,[{width:i,height:n,bottom:n,right:i,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()));}});}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null);}detach(){this.disable(),this._overlayRef=null;}},Pi=(()=>{class o{_injector=h(Y);noop=()=>new Ce;close=e=>Mi(this._injector,e);block=()=>Di(this._injector);reposition=e=>Se(this._injector,e);static \u0275fac=function(i){return new(i||o)};static \u0275prov=P({token:o,factory:o.\u0275fac})}return o})(),we=class{positionStrategy;scrollStrategy=new Ce;panelClass="";hasBackdrop=false;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=false;usePopover;eventPredicate;constructor(t){if(t){let e=Object.keys(t);for(let i of e)t[i]!==void 0&&(this[i]=t[i]);}}};var He=class{connectionPair;scrollableViewProperties;constructor(t,e){this.connectionPair=t,this.scrollableViewProperties=e;}};var Ti=(()=>{class o{_attachedOverlays=[];_document=h(L);_isAttached=false;ngOnDestroy(){this.detach();}add(e){this.remove(e),this._attachedOverlays.push(e);}remove(e){let i=this._attachedOverlays.indexOf(e);i>-1&&this._attachedOverlays.splice(i,1),this._attachedOverlays.length===0&&this.detach();}canReceiveEvent(e,i,n){return n.observers.length<1?false:e.eventPredicate?e.eventPredicate(i):true}static \u0275fac=function(i){return new(i||o)};static \u0275prov=P({token:o,factory:o.\u0275fac})}return o})(),Ai=(()=>{class o extends Ti{_ngZone=h(B);_renderer=h(Ge$2).createRenderer(null,null);_cleanupKeydown;add(e){super.add(e),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener);}),this._isAttached=true);}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=false);}_keydownListener=e=>{let i=this._attachedOverlays;for(let n=i.length-1;n>-1;n--){let r=i[n];if(this.canReceiveEvent(r,e,r._keydownEvents)){this._ngZone.run(()=>r._keydownEvents.next(e));break}}};static \u0275fac=function(i){return new(i||o)};static \u0275prov=P({token:o,factory:o.\u0275fac})}return o})(),Vi=(()=>{class o extends Ti{_platform=h(ft$1);_ngZone=h(B);_renderer=h(Ge$2).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=false;_pointerDownEventTarget=null;_cleanups;add(e){if(super.add(e),!this._isAttached){let i=this._document.body,n={capture:true},r=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[r.listen(i,"pointerdown",this._pointerDownListener,n),r.listen(i,"click",this._clickListener,n),r.listen(i,"auxclick",this._clickListener,n),r.listen(i,"contextmenu",this._clickListener,n)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=i.style.cursor,i.style.cursor="pointer",this._cursorStyleIsSet=true),this._isAttached=true;}}detach(){this._isAttached&&(this._cleanups?.forEach(e=>e()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=false),this._isAttached=false);}_pointerDownListener=e=>{this._pointerDownEventTarget=qe(e);};_clickListener=e=>{let i=qe(e),n=e.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:i;this._pointerDownEventTarget=null;let r=this._attachedOverlays.slice();for(let s=r.length-1;s>-1;s--){let l=r[s],c=l._outsidePointerEvents;if(!(!l.hasAttached()||!this.canReceiveEvent(l,e,c))){if(Si(l.overlayElement,i)||Si(l.overlayElement,n))break;this._ngZone?this._ngZone.run(()=>c.next(e)):c.next(e);}}};static \u0275fac=function(i){return new(i||o)};static \u0275prov=P({token:o,factory:o.\u0275fac})}return o})();function Si(o,t){let e=typeof ShadowRoot<"u"&&ShadowRoot,i=t;for(;i;){if(i===o)return  true;i=e&&i instanceof ShadowRoot?i.host:i.parentNode;}return  false}var Ii=(()=>{class o{static \u0275fac=function(i){return new(i||o)};static \u0275cmp=ut$1({type:o,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(i,n){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
  pointer-events: none;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.cdk-overlay-container {
  position: fixed;
}
@layer cdk-overlay {
  .cdk-overlay-container {
    z-index: 1000;
  }
}
.cdk-overlay-container:empty {
  display: none;
}

.cdk-global-overlay-wrapper {
  display: flex;
  position: absolute;
}
@layer cdk-overlay {
  .cdk-global-overlay-wrapper {
    z-index: 1000;
  }
}

.cdk-overlay-pane {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  display: flex;
  max-width: 100%;
  max-height: 100%;
}
@layer cdk-overlay {
  .cdk-overlay-pane {
    z-index: 1000;
  }
}

.cdk-overlay-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  opacity: 0;
  touch-action: manipulation;
}
@layer cdk-overlay {
  .cdk-overlay-backdrop {
    z-index: 1000;
    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}
@media (prefers-reduced-motion) {
  .cdk-overlay-backdrop {
    transition-duration: 1ms;
  }
}

.cdk-overlay-backdrop-showing {
  opacity: 1;
}
@media (forced-colors: active) {
  .cdk-overlay-backdrop-showing {
    opacity: 0.6;
  }
}

@layer cdk-overlay {
  .cdk-overlay-dark-backdrop {
    background: rgba(0, 0, 0, 0.32);
  }
}

.cdk-overlay-transparent-backdrop {
  transition: visibility 1ms linear, opacity 1ms linear;
  visibility: hidden;
  opacity: 1;
}
.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {
  opacity: 0;
  visibility: visible;
}

.cdk-overlay-backdrop-noop-animation {
  transition: none;
}

.cdk-overlay-connected-position-bounding-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 1px;
  min-height: 1px;
}
@layer cdk-overlay {
  .cdk-overlay-connected-position-bounding-box {
    z-index: 1000;
  }
}

.cdk-global-scrollblock {
  position: fixed;
  width: 100%;
  overflow-y: scroll;
}

.cdk-overlay-popover {
  background: none;
  border: none;
  padding: 0;
  outline: 0;
  overflow: visible;
  position: fixed;
  pointer-events: none;
  white-space: normal;
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  inset: auto;
  top: 0;
  left: 0;
}
.cdk-overlay-popover::backdrop {
  display: none;
}
.cdk-overlay-popover .cdk-overlay-backdrop {
  position: fixed;
  z-index: auto;
}
`],encapsulation:2})}return o})(),Fi=(()=>{class o{_platform=h(ft$1);_containerElement;_document=h(L);_styleLoader=h(ii);ngOnDestroy(){this._containerElement?.remove();}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let e="cdk-overlay-container";if(this._platform.isBrowser||V8()){let n=this._document.querySelectorAll(`.${e}[platform="server"], .${e}[platform="test"]`);for(let r=0;r<n.length;r++)n[r].remove();}let i=this._document.createElement("div");i.classList.add(e),V8()?i.setAttribute("platform","test"):this._platform.isBrowser||i.setAttribute("platform","server"),this._document.body.appendChild(i),this._containerElement=i;}_loadStyles(){this._styleLoader.load(Ii);}static \u0275fac=function(i){return new(i||o)};static \u0275prov=P({token:o,factory:o.\u0275fac})}return o})(),at=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(t,e,i,n){this._renderer=e,this._ngZone=i,this.element=t.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=e.listen(this.element,"click",n);}detach(){this._ngZone.runOutsideAngular(()=>{let t=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(t,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),t.style.pointerEvents="none",t.classList.remove("cdk-overlay-backdrop-showing");});}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove();}};function lt(o){return o&&o.nodeType===1}var Ye=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new G;_attachments=new G;_detachments=new G;_positionStrategy;_scrollStrategy;_locationChanges=X.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=false;_previousHostParent;_keydownEvents=new G;_outsidePointerEvents=new G;_afterNextRenderRef;constructor(t,e,i,n,r,s,l,c,u,d=false,p,b){this._portalOutlet=t,this._host=e,this._pane=i,this._config=n,this._ngZone=r,this._keyboardDispatcher=s,this._document=l,this._location=c,this._outsideClickDispatcher=u,this._animationsDisabled=d,this._injector=p,this._renderer=b,n.scrollStrategy&&(this._scrollStrategy=n.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=n.positionStrategy;}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(t){if(this._disposed)return null;this._attachHost();let e=this._portalOutlet.attach(t);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=Cu(()=>{this.hasAttached()&&this.updatePosition();},{injector:this._injector}),this._togglePointerEvents(true),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,true),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof e?.onDestroy=="function"&&e.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()));}),e}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(false),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let t=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),t}dispose(){if(this._disposed)return;let t=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,t&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=true;}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply();}updatePositionStrategy(t){t!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=t,this.hasAttached()&&(t.attach(this),this.updatePosition()));}updateSize(t){this._config=l(l({},this._config),t),this._updateElementSize();}setDirection(t){this._config=m(l({},this._config),{direction:t}),this._updateElementDirection();}addPanelClass(t){this._pane&&this._toggleClasses(this._pane,t,true);}removePanelClass(t){this._pane&&this._toggleClasses(this._pane,t,false);}getDirection(){let t=this._config.direction;return t?typeof t=="string"?t:t.value:"ltr"}updateScrollStrategy(t){t!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=t,this.hasAttached()&&(t.attach(this),t.enable()));}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection());}_updateElementSize(){if(!this._pane)return;let t=this._pane.style;t.width=X8(this._config.width),t.height=X8(this._config.height),t.minWidth=X8(this._config.minWidth),t.minHeight=X8(this._config.minHeight),t.maxWidth=X8(this._config.maxWidth),t.maxHeight=X8(this._config.maxHeight);}_togglePointerEvents(t){this._pane.style.pointerEvents=t?"":"none";}_attachHost(){if(!this._host.parentElement){let t=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;lt(t)?t.after(this._host):t?.type==="parent"?t.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host);}if(this._config.usePopover)try{this._host.showPopover();}catch{}}_attachBackdrop(){let t="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new at(this._document,this._renderer,this._ngZone,e=>{this._backdropClick.next(e);}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,true),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(t));}):this._backdropRef.element.classList.add(t);}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host);}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach();}_toggleClasses(t,e,i){let n=x$(e||[]).filter(r=>!!r);n.length&&(i?t.classList.add(...n):t.classList.remove(...n));}_detachContentWhenEmpty(){let t=false;try{this._detachContentAfterRenderRef=Cu(()=>{t=!0,this._detachContent();},{injector:this._injector});}catch(e){if(t)throw e;this._detachContent();}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent();}),this._detachContentMutationObserver.observe(this._pane,{childList:true}));}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,false),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent());}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect();}_disposeScrollStrategy(){let t=this._scrollStrategy;t?.disable(),t?.detach?.();}},ki="cdk-overlay-connected-position-bounding-box",nn=/([A-Za-z%]+)$/;function ct(o,t){return new je(t,o.get(te),o.get(L),o.get(ft$1),o.get(Fi))}var je=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=false;_lastBoundingBoxSize={width:0,height:0};_isPushed=false;_canPush=true;_growAfterOpen=false;_hasFlexibleDimensions=true;_positionLocked=false;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=false;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new G;_resizeSubscription=X.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation="global";positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(t,e,i,n,r){this._viewportRuler=e,this._document=i,this._platform=n,this._overlayContainer=r,this.setOrigin(t);}attach(t){this._overlayRef&&this._overlayRef,this._validatePositions(),t.hostElement.classList.add(ki),this._overlayRef=t,this._boundingBox=t.hostElement,this._pane=t.overlayElement,this._isDisposed=false,this._isInitialRender=true,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=true,this.apply();});}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let t=this._originRect,e=this._overlayRect,i=this._viewportRect,n=this._containerRect,r=[],s;for(let l of this._preferredPositions){let c=this._getOriginPoint(t,n,l),u=this._getOverlayPoint(c,e,l),d=this._getOverlayFit(u,e,i,l);if(d.isCompletelyWithinViewport){this._isPushed=false,this._applyPosition(l,c);return}if(this._canFitWithFlexibleDimensions(d,u,i)){r.push({position:l,origin:c,overlayRect:e,boundingBoxRect:this._calculateBoundingBoxRect(c,l)});continue}(!s||s.overlayFit.visibleArea<d.visibleArea)&&(s={overlayFit:d,overlayPoint:u,originPoint:c,position:l,overlayRect:e});}if(r.length){let l=null,c=-1;for(let u of r){let d=u.boundingBoxRect.width*u.boundingBoxRect.height*(u.position.weight||1);d>c&&(c=d,l=u);}this._isPushed=false,this._applyPosition(l.position,l.origin);return}if(this._canPush){this._isPushed=true,this._applyPosition(s.position,s.originPoint);return}this._applyPosition(s.position,s.originPoint);}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe();}dispose(){this._isDisposed||(this._boundingBox&&ie(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(ki),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=true);}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let t=this._lastPosition;t?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(t,this._getOriginPoint(this._originRect,this._containerRect,t))):this.apply();}withScrollableContainers(t){return this._scrollables=t,this}withPositions(t){return this._preferredPositions=t,t.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(t){return this._viewportMargin=t,this}withFlexibleDimensions(t=true){return this._hasFlexibleDimensions=t,this}withGrowAfterOpen(t=true){return this._growAfterOpen=t,this}withPush(t=true){return this._canPush=t,this}withLockedPosition(t=true){return this._positionLocked=t,this}setOrigin(t){return this._origin=t,this}withDefaultOffsetX(t){return this._offsetX=t,this}withDefaultOffsetY(t){return this._offsetY=t,this}withTransformOriginOn(t){return this._transformOriginSelector=t,this}withPopoverLocation(t){return this._popoverLocation=t,this}getPopoverInsertionPoint(){return this._popoverLocation==="global"?null:this._popoverLocation!=="inline"?this._popoverLocation:this._origin instanceof re?this._origin.nativeElement:lt(this._origin)?this._origin:null}_getOriginPoint(t,e,i){let n;if(i.originX=="center")n=t.left+t.width/2;else {let s=this._isRtl()?t.right:t.left,l=this._isRtl()?t.left:t.right;n=i.originX=="start"?s:l;}e.left<0&&(n-=e.left);let r;return i.originY=="center"?r=t.top+t.height/2:r=i.originY=="top"?t.top:t.bottom,e.top<0&&(r-=e.top),{x:n,y:r}}_getOverlayPoint(t,e,i){let n;i.overlayX=="center"?n=-e.width/2:i.overlayX==="start"?n=this._isRtl()?-e.width:0:n=this._isRtl()?0:-e.width;let r;return i.overlayY=="center"?r=-e.height/2:r=i.overlayY=="top"?0:-e.height,{x:t.x+n,y:t.y+r}}_getOverlayFit(t,e,i,n){let r=Oi(e),{x:s,y:l}=t,c=this._getOffset(n,"x"),u=this._getOffset(n,"y");c&&(s+=c),u&&(l+=u);let d=0-s,p=s+r.width-i.width,b=0-l,O=l+r.height-i.height,w=this._subtractOverflows(r.width,d,p),V=this._subtractOverflows(r.height,b,O),gt=w*V;return {visibleArea:gt,isCompletelyWithinViewport:r.width*r.height===gt,fitsInViewportVertically:V===r.height,fitsInViewportHorizontally:w==r.width}}_canFitWithFlexibleDimensions(t,e,i){if(this._hasFlexibleDimensions){let n=i.bottom-e.y,r=i.right-e.x,s=xi(this._overlayRef.getConfig().minHeight),l=xi(this._overlayRef.getConfig().minWidth),c=t.fitsInViewportVertically||s!=null&&s<=n,u=t.fitsInViewportHorizontally||l!=null&&l<=r;return c&&u}return  false}_pushOverlayOnScreen(t,e,i){if(this._previousPushAmount&&this._positionLocked)return {x:t.x+this._previousPushAmount.x,y:t.y+this._previousPushAmount.y};let n=Oi(e),r=this._viewportRect,s=Math.max(t.x+n.width-r.width,0),l=Math.max(t.y+n.height-r.height,0),c=Math.max(r.top-i.top-t.y,0),u=Math.max(r.left-i.left-t.x,0),d=0,p=0;return n.width<=r.width?d=u||-s:d=t.x<this._getViewportMarginStart()?r.left-i.left-t.x:0,n.height<=r.height?p=c||-l:p=t.y<this._getViewportMarginTop()?r.top-i.top-t.y:0,this._previousPushAmount={x:d,y:p},{x:t.x+d,y:t.y+p}}_applyPosition(t,e){if(this._setTransformOrigin(t),this._setOverlayElementStyles(e,t),this._setBoundingBoxStyles(e,t),t.panelClass&&this._addPanelClasses(t.panelClass),this._positionChanges.observers.length){let i=this._getScrollVisibility();if(t!==this._lastPosition||!this._lastScrollVisibility||!on(this._lastScrollVisibility,i)){let n=new He(t,i);this._positionChanges.next(n);}this._lastScrollVisibility=i;}this._lastPosition=t,this._isInitialRender=false;}_setTransformOrigin(t){if(!this._transformOriginSelector)return;let e=this._boundingBox.querySelectorAll(this._transformOriginSelector),i,n=t.overlayY;t.overlayX==="center"?i="center":this._isRtl()?i=t.overlayX==="start"?"right":"left":i=t.overlayX==="start"?"left":"right";for(let r=0;r<e.length;r++)e[r].style.transformOrigin=`${i} ${n}`;}_calculateBoundingBoxRect(t,e){let i=this._viewportRect,n=this._isRtl(),r,s,l;if(e.overlayY==="top")s=t.y,r=i.height-s+this._getViewportMarginBottom();else if(e.overlayY==="bottom")l=i.height-t.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),r=i.height-l+this._getViewportMarginTop();else {let O=Math.min(i.bottom-t.y+i.top,t.y),w=this._lastBoundingBoxSize.height;r=O*2,s=t.y-O,r>w&&!this._isInitialRender&&!this._growAfterOpen&&(s=t.y-w/2);}let c=e.overlayX==="start"&&!n||e.overlayX==="end"&&n,u=e.overlayX==="end"&&!n||e.overlayX==="start"&&n,d,p,b;if(u)b=i.width-t.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),d=t.x-this._getViewportMarginStart();else if(c)p=t.x,d=i.right-t.x-this._getViewportMarginEnd();else {let O=Math.min(i.right-t.x+i.left,t.x),w=this._lastBoundingBoxSize.width;d=O*2,p=t.x-O,d>w&&!this._isInitialRender&&!this._growAfterOpen&&(p=t.x-w/2);}return {top:s,left:p,bottom:l,right:b,width:d,height:r}}_setBoundingBoxStyles(t,e){let i=this._calculateBoundingBoxRect(t,e);!this._isInitialRender&&!this._growAfterOpen&&(i.height=Math.min(i.height,this._lastBoundingBoxSize.height),i.width=Math.min(i.width,this._lastBoundingBoxSize.width));let n={};if(this._hasExactPosition())n.top=n.left="0",n.bottom=n.right="auto",n.maxHeight=n.maxWidth="",n.width=n.height="100%";else {let r=this._overlayRef.getConfig().maxHeight,s=this._overlayRef.getConfig().maxWidth;n.width=X8(i.width),n.height=X8(i.height),n.top=X8(i.top)||"auto",n.bottom=X8(i.bottom)||"auto",n.left=X8(i.left)||"auto",n.right=X8(i.right)||"auto",e.overlayX==="center"?n.alignItems="center":n.alignItems=e.overlayX==="end"?"flex-end":"flex-start",e.overlayY==="center"?n.justifyContent="center":n.justifyContent=e.overlayY==="bottom"?"flex-end":"flex-start",r&&(n.maxHeight=X8(r)),s&&(n.maxWidth=X8(s));}this._lastBoundingBoxSize=i,ie(this._boundingBox.style,n);}_resetBoundingBoxStyles(){ie(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""});}_resetOverlayElementStyles(){ie(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""});}_setOverlayElementStyles(t,e){let i={},n=this._hasExactPosition(),r=this._hasFlexibleDimensions,s=this._overlayRef.getConfig();if(n){let d=this._viewportRuler.getViewportScrollPosition();ie(i,this._getExactOverlayY(e,t,d)),ie(i,this._getExactOverlayX(e,t,d));}else i.position="static";let l="",c=this._getOffset(e,"x"),u=this._getOffset(e,"y");c&&(l+=`translateX(${c}px) `),u&&(l+=`translateY(${u}px)`),i.transform=l.trim(),s.maxHeight&&(n?i.maxHeight=X8(s.maxHeight):r&&(i.maxHeight="")),s.maxWidth&&(n?i.maxWidth=X8(s.maxWidth):r&&(i.maxWidth="")),ie(this._pane.style,i);}_getExactOverlayY(t,e,i){let n={top:"",bottom:""},r=this._getOverlayPoint(e,this._overlayRect,t);if(this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,i)),t.overlayY==="bottom"){let s=this._document.documentElement.clientHeight;n.bottom=`${s-(r.y+this._overlayRect.height)}px`;}else n.top=X8(r.y);return n}_getExactOverlayX(t,e,i){let n={left:"",right:""},r=this._getOverlayPoint(e,this._overlayRect,t);this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,i));let s;if(this._isRtl()?s=t.overlayX==="end"?"left":"right":s=t.overlayX==="end"?"right":"left",s==="right"){let l=this._document.documentElement.clientWidth;n.right=`${l-(r.x+this._overlayRect.width)}px`;}else n.left=X8(r.x);return n}_getScrollVisibility(){let t=this._getOriginRect(),e=this._pane.getBoundingClientRect(),i=this._scrollables.map(n=>n.getElementRef().nativeElement.getBoundingClientRect());return {isOriginClipped:wi(t,i),isOriginOutsideView:st(t,i),isOverlayClipped:wi(e,i),isOverlayOutsideView:st(e,i)}}_subtractOverflows(t,...e){return e.reduce((i,n)=>i-Math.max(n,0),t)}_getNarrowedViewportRect(){let t=this._document.documentElement.clientWidth,e=this._document.documentElement.clientHeight,i=this._viewportRuler.getViewportScrollPosition();return {top:i.top+this._getViewportMarginTop(),left:i.left+this._getViewportMarginStart(),right:i.left+t-this._getViewportMarginEnd(),bottom:i.top+e-this._getViewportMarginBottom(),width:t-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:e-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return !this._hasFlexibleDimensions||this._isPushed}_getOffset(t,e){return e==="x"?t.offsetX==null?this._offsetX:t.offsetX:t.offsetY==null?this._offsetY:t.offsetY}_validatePositions(){}_addPanelClasses(t){this._pane&&x$(t).forEach(e=>{e!==""&&this._appliedPanelClasses.indexOf(e)===-1&&(this._appliedPanelClasses.push(e),this._pane.classList.add(e));});}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(t=>{this._pane.classList.remove(t);}),this._appliedPanelClasses=[]);}_getViewportMarginStart(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let t=this._origin;if(t instanceof re)return t.nativeElement.getBoundingClientRect();if(t instanceof Element)return t.getBoundingClientRect();let e=t.width||0,i=t.height||0;return {top:t.y,bottom:t.y+i,left:t.x,right:t.x+e,height:i,width:e}}_getContainerRect(){let t=this._overlayRef.getConfig().usePopover&&this._popoverLocation!=="global",e=this._overlayContainer.getContainerElement();t&&(e.style.display="block");let i=e.getBoundingClientRect();return t&&(e.style.display=""),i}};function ie(o,t){for(let e in t)t.hasOwnProperty(e)&&(o[e]=t[e]);return o}function xi(o){if(typeof o!="number"&&o!=null){let[t,e]=o.split(nn);return !e||e==="px"?parseFloat(t):null}return o||null}function Oi(o){return {top:Math.floor(o.top),right:Math.floor(o.right),bottom:Math.floor(o.bottom),left:Math.floor(o.left),width:Math.floor(o.width),height:Math.floor(o.height)}}function on(o,t){return o===t?true:o.isOriginClipped===t.isOriginClipped&&o.isOriginOutsideView===t.isOriginOutsideView&&o.isOverlayClipped===t.isOverlayClipped&&o.isOverlayOutsideView===t.isOverlayOutsideView}var Ri="cdk-global-overlay-wrapper";function Bi(o){return new Xe}var Xe=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=false;attach(t){let e=t.getConfig();this._overlayRef=t,this._width&&!e.width&&t.updateSize({width:this._width}),this._height&&!e.height&&t.updateSize({height:this._height}),t.hostElement.classList.add(Ri),this._isDisposed=false;}top(t=""){return this._bottomOffset="",this._topOffset=t,this._alignItems="flex-start",this}left(t=""){return this._xOffset=t,this._xPosition="left",this}bottom(t=""){return this._topOffset="",this._bottomOffset=t,this._alignItems="flex-end",this}right(t=""){return this._xOffset=t,this._xPosition="right",this}start(t=""){return this._xOffset=t,this._xPosition="start",this}end(t=""){return this._xOffset=t,this._xPosition="end",this}width(t=""){return this._overlayRef?this._overlayRef.updateSize({width:t}):this._width=t,this}height(t=""){return this._overlayRef?this._overlayRef.updateSize({height:t}):this._height=t,this}centerHorizontally(t=""){return this.left(t),this._xPosition="center",this}centerVertically(t=""){return this.top(t),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let t=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement.style,i=this._overlayRef.getConfig(),{width:n,height:r,maxWidth:s,maxHeight:l}=i,c=(n==="100%"||n==="100vw")&&(!s||s==="100%"||s==="100vw"),u=(r==="100%"||r==="100vh")&&(!l||l==="100%"||l==="100vh"),d=this._xPosition,p=this._xOffset,b=this._overlayRef.getConfig().direction==="rtl",O="",w="",V="";c?V="flex-start":d==="center"?(V="center",b?w=p:O=p):b?d==="left"||d==="end"?(V="flex-end",O=p):(d==="right"||d==="start")&&(V="flex-start",w=p):d==="left"||d==="start"?(V="flex-start",O=p):(d==="right"||d==="end")&&(V="flex-end",w=p),t.position=this._cssPosition,t.marginLeft=c?"0":O,t.marginTop=u?"0":this._topOffset,t.marginBottom=this._bottomOffset,t.marginRight=c?"0":w,e.justifyContent=V,e.alignItems=u?"flex-start":this._alignItems;}dispose(){if(this._isDisposed||!this._overlayRef)return;let t=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement,i=e.style;e.classList.remove(Ri),i.justifyContent=i.alignItems=t.marginTop=t.marginBottom=t.marginLeft=t.marginRight=t.position="",this._overlayRef=null,this._isDisposed=true;}},Ni=(()=>{class o{_injector=h(Y);global(){return Bi()}flexibleConnectedTo(e){return ct(this._injector,e)}static \u0275fac=function(i){return new(i||o)};static \u0275prov=P({token:o,factory:o.\u0275fac})}return o})(),ke=new g("OVERLAY_DEFAULT_CONFIG");function dt(o,t){o.get(ii).load(Ii);let e=o.get(Fi),i=o.get(L),n=o.get(Zd),r=o.get($t),s=o.get(nS),l=o.get(lt$1,null,{optional:true})||o.get(Ge$2).createRenderer(null,null),c=new we(t),u=o.get(ke,null,{optional:true})?.usePopover??true;c.direction=c.direction||s.value,"showPopover"in i.body?c.usePopover=t?.usePopover??u:c.usePopover=false;let d=i.createElement("div"),p=i.createElement("div");d.id=n.getId("cdk-overlay-"),d.classList.add("cdk-overlay-pane"),p.appendChild(d),c.usePopover&&(p.setAttribute("popover","manual"),p.classList.add("cdk-overlay-popover"));let b=c.usePopover?c.positionStrategy?.getPopoverInsertionPoint?.():null;return lt(b)?b.after(p):b?.type==="parent"?b.element.appendChild(p):e.getContainerElement().appendChild(p),new Ye(new Ne(d,r,o),p,d,c,o.get(B),o.get(Ai),i,o.get(sy),o.get(Vi),t?.disableAnimations??o.get(gl,null,{optional:true})==="NoopAnimations",o.get(ie$1),l)}var Li=(()=>{class o{scrollStrategies=h(Pi);_positionBuilder=h(Ni);_injector=h(Y);create(e){return dt(this._injector,e)}position(){return this._positionBuilder}static \u0275fac=function(i){return new(i||o)};static \u0275prov=P({token:o,factory:o.\u0275fac})}return o})(),rn=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],sn=new g("cdk-connected-overlay-scroll-strategy",{providedIn:"root",factory:()=>{let o=h(Y);return ()=>Se(o)}}),ae=(()=>{class o{elementRef=h(re);static \u0275fac=function(i){return new(i||o)};static \u0275dir=$({type:o,selectors:[["","cdk-overlay-origin",""],["","overlay-origin",""],["","cdkOverlayOrigin",""]],exportAs:["cdkOverlayOrigin"]})}return o})(),zi=new g("cdk-connected-overlay-default-config"),Ge=(()=>{class o{_dir=h(nS,{optional:true});_injector=h(Y);_overlayRef;_templatePortal;_backdropSubscription=X.EMPTY;_attachSubscription=X.EMPTY;_detachSubscription=X.EMPTY;_positionSubscription=X.EMPTY;_offsetX;_offsetY;_position;_scrollStrategyFactory=h(sn);_ngZone=h(B);origin;positions;positionStrategy;get offsetX(){return this._offsetX}set offsetX(e){this._offsetX=e,this._position&&this._updatePositionStrategy(this._position);}get offsetY(){return this._offsetY}set offsetY(e){this._offsetY=e,this._position&&this._updatePositionStrategy(this._position);}width;height;minWidth;minHeight;backdropClass;panelClass;viewportMargin=0;scrollStrategy;open=false;disableClose=false;transformOriginSelector;hasBackdrop=false;lockPosition=false;flexibleDimensions=false;growAfterOpen=false;push=false;disposeOnNavigation=false;usePopover;matchWidth=false;set _config(e){typeof e!="string"&&this._assignConfig(e);}backdropClick=new ee;positionChange=new ee;attach=new ee;detach=new ee;overlayKeydown=new ee;overlayOutsideClick=new ee;constructor(){let e=h(Cr),i=h(Ar),n=h(zi,{optional:true}),r=h(ke,{optional:true});this.usePopover=r?.usePopover===false?null:"global",this._templatePortal=new be(e,i),this.scrollStrategy=this._scrollStrategyFactory(),n&&this._assignConfig(n);}get overlayRef(){return this._overlayRef}get dir(){return this._dir?this._dir.value:"ltr"}ngOnDestroy(){this._attachSubscription.unsubscribe(),this._detachSubscription.unsubscribe(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this._overlayRef?.dispose();}ngOnChanges(e){this._position&&(this._updatePositionStrategy(this._position),this._overlayRef?.updateSize({width:this._getWidth(),minWidth:this.minWidth,height:this.height,minHeight:this.minHeight}),e.origin&&this.open&&this._position.apply()),e.open&&(this.open?this.attachOverlay():this.detachOverlay());}_createOverlay(){(!this.positions||!this.positions.length)&&(this.positions=rn);let e=this._overlayRef=dt(this._injector,this._buildConfig());this._attachSubscription=e.attachments().subscribe(()=>this.attach.emit()),this._detachSubscription=e.detachments().subscribe(()=>this.detach.emit()),e.keydownEvents().subscribe(i=>{this.overlayKeydown.next(i),i.keyCode===27&&!this.disableClose&&!Cv(i)&&(i.preventDefault(),this.detachOverlay());}),this._overlayRef.outsidePointerEvents().subscribe(i=>{let n=this._getOriginElement(),r=qe(i);(!n||n!==r&&!n.contains(r))&&this.overlayOutsideClick.next(i);});}_buildConfig(){let e=this._position=this.positionStrategy||this._createPositionStrategy(),i=new we({direction:this._dir||"ltr",positionStrategy:e,scrollStrategy:this.scrollStrategy,hasBackdrop:this.hasBackdrop,disposeOnNavigation:this.disposeOnNavigation,usePopover:!!this.usePopover});return (this.height||this.height===0)&&(i.height=this.height),(this.minWidth||this.minWidth===0)&&(i.minWidth=this.minWidth),(this.minHeight||this.minHeight===0)&&(i.minHeight=this.minHeight),this.backdropClass&&(i.backdropClass=this.backdropClass),this.panelClass&&(i.panelClass=this.panelClass),i}_updatePositionStrategy(e){let i=this.positions.map(n=>({originX:n.originX,originY:n.originY,overlayX:n.overlayX,overlayY:n.overlayY,offsetX:n.offsetX||this.offsetX,offsetY:n.offsetY||this.offsetY,panelClass:n.panelClass||void 0}));return e.setOrigin(this._getOrigin()).withPositions(i).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover===null?"global":this.usePopover)}_createPositionStrategy(){let e=ct(this._injector,this._getOrigin());return this._updatePositionStrategy(e),e}_getOrigin(){return this.origin instanceof ae?this.origin.elementRef:this.origin}_getOriginElement(){return this.origin instanceof ae?this.origin.elementRef.nativeElement:this.origin instanceof re?this.origin.nativeElement:typeof Element<"u"&&this.origin instanceof Element?this.origin:null}_getWidth(){return this.width?this.width:this.matchWidth?this._getOriginElement()?.getBoundingClientRect?.().width:void 0}attachOverlay(){this._overlayRef||this._createOverlay();let e=this._overlayRef;e.getConfig().hasBackdrop=this.hasBackdrop,e.updateSize({width:this._getWidth()}),e.hasAttached()||e.attach(this._templatePortal),this.hasBackdrop?this._backdropSubscription=e.backdropClick().subscribe(i=>this.backdropClick.emit(i)):this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.positionChange.observers.length>0&&(this._positionSubscription=this._position.positionChanges.pipe(Ab(()=>this.positionChange.observers.length>0)).subscribe(i=>{this._ngZone.run(()=>this.positionChange.emit(i)),this.positionChange.observers.length===0&&this._positionSubscription.unsubscribe();})),this.open=true;}detachOverlay(){this._overlayRef?.detach(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.open=false;}_assignConfig(e){this.origin=e.origin??this.origin,this.positions=e.positions??this.positions,this.positionStrategy=e.positionStrategy??this.positionStrategy,this.offsetX=e.offsetX??this.offsetX,this.offsetY=e.offsetY??this.offsetY,this.width=e.width??this.width,this.height=e.height??this.height,this.minWidth=e.minWidth??this.minWidth,this.minHeight=e.minHeight??this.minHeight,this.backdropClass=e.backdropClass??this.backdropClass,this.panelClass=e.panelClass??this.panelClass,this.viewportMargin=e.viewportMargin??this.viewportMargin,this.scrollStrategy=e.scrollStrategy??this.scrollStrategy,this.disableClose=e.disableClose??this.disableClose,this.transformOriginSelector=e.transformOriginSelector??this.transformOriginSelector,this.hasBackdrop=e.hasBackdrop??this.hasBackdrop,this.lockPosition=e.lockPosition??this.lockPosition,this.flexibleDimensions=e.flexibleDimensions??this.flexibleDimensions,this.growAfterOpen=e.growAfterOpen??this.growAfterOpen,this.push=e.push??this.push,this.disposeOnNavigation=e.disposeOnNavigation??this.disposeOnNavigation,this.usePopover=e.usePopover??this.usePopover,this.matchWidth=e.matchWidth??this.matchWidth;}static \u0275fac=function(i){return new(i||o)};static \u0275dir=$({type:o,selectors:[["","cdk-connected-overlay",""],["","connected-overlay",""],["","cdkConnectedOverlay",""]],inputs:{origin:[0,"cdkConnectedOverlayOrigin","origin"],positions:[0,"cdkConnectedOverlayPositions","positions"],positionStrategy:[0,"cdkConnectedOverlayPositionStrategy","positionStrategy"],offsetX:[0,"cdkConnectedOverlayOffsetX","offsetX"],offsetY:[0,"cdkConnectedOverlayOffsetY","offsetY"],width:[0,"cdkConnectedOverlayWidth","width"],height:[0,"cdkConnectedOverlayHeight","height"],minWidth:[0,"cdkConnectedOverlayMinWidth","minWidth"],minHeight:[0,"cdkConnectedOverlayMinHeight","minHeight"],backdropClass:[0,"cdkConnectedOverlayBackdropClass","backdropClass"],panelClass:[0,"cdkConnectedOverlayPanelClass","panelClass"],viewportMargin:[0,"cdkConnectedOverlayViewportMargin","viewportMargin"],scrollStrategy:[0,"cdkConnectedOverlayScrollStrategy","scrollStrategy"],open:[0,"cdkConnectedOverlayOpen","open"],disableClose:[0,"cdkConnectedOverlayDisableClose","disableClose"],transformOriginSelector:[0,"cdkConnectedOverlayTransformOriginOn","transformOriginSelector"],hasBackdrop:[2,"cdkConnectedOverlayHasBackdrop","hasBackdrop",Tt],lockPosition:[2,"cdkConnectedOverlayLockPosition","lockPosition",Tt],flexibleDimensions:[2,"cdkConnectedOverlayFlexibleDimensions","flexibleDimensions",Tt],growAfterOpen:[2,"cdkConnectedOverlayGrowAfterOpen","growAfterOpen",Tt],push:[2,"cdkConnectedOverlayPush","push",Tt],disposeOnNavigation:[2,"cdkConnectedOverlayDisposeOnNavigation","disposeOnNavigation",Tt],usePopover:[0,"cdkConnectedOverlayUsePopover","usePopover"],matchWidth:[2,"cdkConnectedOverlayMatchWidth","matchWidth",Tt],_config:[0,"cdkConnectedOverlay","_config"]},outputs:{backdropClick:"backdropClick",positionChange:"positionChange",attach:"attach",detach:"detach",overlayKeydown:"overlayKeydown",overlayOutsideClick:"overlayOutsideClick"},exportAs:["cdkConnectedOverlay"],features:[It]})}return o})(),ht=(()=>{class o{static \u0275fac=function(i){return new(i||o)};static \u0275mod=fe({type:o});static \u0275inj=se({providers:[Li],imports:[Ua,bi,it,it]})}return o})();var Wi=(()=>{class o{_animationsDisabled=$r();state="unchecked";disabled=false;appearance="full";static \u0275fac=function(i){return new(i||o)};static \u0275cmp=ut$1({type:o,selectors:[["mat-pseudo-checkbox"]],hostAttrs:[1,"mat-pseudo-checkbox"],hostVars:12,hostBindings:function(i,n){i&2&&We$1("mat-pseudo-checkbox-indeterminate",n.state==="indeterminate")("mat-pseudo-checkbox-checked",n.state==="checked")("mat-pseudo-checkbox-disabled",n.disabled)("mat-pseudo-checkbox-minimal",n.appearance==="minimal")("mat-pseudo-checkbox-full",n.appearance==="full")("_mat-animation-noopable",n._animationsDisabled);},inputs:{state:"state",disabled:"disabled",appearance:"appearance"},decls:0,vars:0,template:function(i,n){},styles:[`.mat-pseudo-checkbox {
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox::after {
  position: absolute;
  opacity: 0;
  content: "";
  border-bottom: 2px solid currentColor;
  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-pseudo-checkbox._mat-animation-noopable::after {
  transition: none;
}

.mat-pseudo-checkbox-disabled {
  cursor: default;
}

.mat-pseudo-checkbox-indeterminate::after {
  left: 1px;
  opacity: 1;
  border-radius: 2px;
}

.mat-pseudo-checkbox-checked::after {
  left: 1px;
  border-left: 2px solid currentColor;
  transform: rotate(-45deg);
  opacity: 1;
  box-sizing: content-box;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  color: var(--mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--mat-sys-primary));
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-pseudo-checkbox-full {
  border-color: var(--mat-pseudo-checkbox-full-unselected-icon-color, var(--mat-sys-on-surface-variant));
  border-width: 2px;
  border-style: solid;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {
  border-color: var(--mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
  background-color: var(--mat-pseudo-checkbox-full-selected-icon-color, var(--mat-sys-primary));
  border-color: transparent;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  color: var(--mat-pseudo-checkbox-full-selected-checkmark-color, var(--mat-sys-on-primary));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {
  background-color: var(--mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--mat-sys-surface));
}

.mat-pseudo-checkbox {
  width: 18px;
  height: 18px;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {
  width: 14px;
  height: 6px;
  transform-origin: center;
  top: -4.2426406871px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  top: 8px;
  width: 16px;
}

.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {
  width: 10px;
  height: 4px;
  transform-origin: center;
  top: -2.8284271247px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  top: 6px;
  width: 12px;
}
`],encapsulation:2})}return o})();var an=["text"],ln=[[["mat-icon"]],"*"],cn=["mat-icon","*"];function dn(o,t){if(o&1&&mg(0,"mat-pseudo-checkbox",1),o&2){let e=ww();hg("disabled",e.disabled)("state",e.selected?"checked":"unchecked");}}function hn(o,t){if(o&1&&mg(0,"mat-pseudo-checkbox",3),o&2){let e=ww();hg("disabled",e.disabled);}}function pn(o,t){if(o&1&&(Us(0,"span",4),Qw(1),Ku()),o&2){let e=ww();Qs(),Xu("(",e.group.label,")");}}var ut=new g("MAT_OPTION_PARENT_COMPONENT"),ft=new g("MatOptgroup");var pt=class{source;isUserInput;constructor(t,e=false){this.source=t,this.isUserInput=e;}},le=(()=>{class o{_element=h(re);_changeDetectorRef=h(rd);_parent=h(ut,{optional:true});group=h(ft,{optional:true});_signalDisableRipple=false;_selected=false;_active=false;_mostRecentViewValue="";get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=h(Zd).getId("mat-option-");get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e);}_disabled=de(false);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return !!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new ee;_text;_stateChanges=new G;constructor(){let e=h(ii);e.load(Fv),e.load(LM),this._signalDisableRipple=!!this._parent&&Nn(this._parent.disableRipple);}get active(){return this._active}get viewValue(){return (this._text?.nativeElement.textContent||"").trim()}select(e=true){this._selected||(this._selected=true,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent());}deselect(e=true){this._selected&&(this._selected=false,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent());}focus(e,i){let n=this._getHostElement();typeof n.focus=="function"&&n.focus(i);}setActiveStyles(){this._active||(this._active=true,this._changeDetectorRef.markForCheck());}setInactiveStyles(){this._active&&(this._active=false,this._changeDetectorRef.markForCheck());}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!Cv(e)&&(this._selectViaInteraction(),e.preventDefault());}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:true,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(true));}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e);}}ngOnDestroy(){this._stateChanges.complete();}_emitSelectionChangeEvent(e=false){this.onSelectionChange.emit(new pt(this,e));}static \u0275fac=function(i){return new(i||o)};static \u0275cmp=ut$1({type:o,selectors:[["mat-option"]],viewQuery:function(i,n){if(i&1&&Eg(an,7),i&2){let r;Mw(r=Sw())&&(n._text=r.first);}},hostAttrs:["role","option",1,"mat-mdc-option","mdc-list-item"],hostVars:11,hostBindings:function(i,n){i&1&&Gn("click",function(){return n._selectViaInteraction()})("keydown",function(s){return n._handleKeydown(s)}),i&2&&(bg("id",n.id),Bn("aria-selected",n.selected)("aria-disabled",n.disabled.toString()),We$1("mdc-list-item--selected",n.selected)("mat-mdc-option-multiple",n.multiple)("mat-mdc-option-active",n.active)("mdc-list-item--disabled",n.disabled));},inputs:{value:"value",id:"id",disabled:[2,"disabled","disabled",Tt]},outputs:{onSelectionChange:"onSelectionChange"},exportAs:["matOption"],ngContentSelectors:cn,decls:8,vars:5,consts:[["text",""],["aria-hidden","true",1,"mat-mdc-option-pseudo-checkbox",3,"disabled","state"],[1,"mdc-list-item__primary-text"],["state","checked","aria-hidden","true","appearance","minimal",1,"mat-mdc-option-pseudo-checkbox",3,"disabled"],[1,"cdk-visually-hidden"],["aria-hidden","true","mat-ripple","",1,"mat-mdc-option-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled"]],template:function(i,n){i&1&&(ia(ln),ra(0,dn,1,2,"mat-pseudo-checkbox",1),zn(1),Us(2,"span",2,0),zn(4,1),Ku(),ra(5,hn,1,1,"mat-pseudo-checkbox",3),ra(6,pn,2,1,"span",4),mg(7,"div",5)),i&2&&(oa(n.multiple?0:-1),Qs(5),oa(!n.multiple&&n.selected&&!n.hideSingleSelectionIndicator?5:-1),Qs(),oa(n.group&&n.group._inert?6:-1),Qs(),hg("matRippleTrigger",n._getHostElement())("matRippleDisabled",n.disabled||n.disableRipple));},dependencies:[Wi,m3],styles:[`.mat-mdc-option {
  -webkit-user-select: none;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--mat-option-label-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-option-label-text-font, var(--mat-sys-label-large-font));
  line-height: var(--mat-option-label-text-line-height, var(--mat-sys-label-large-line-height));
  font-size: var(--mat-option-label-text-size, var(--mat-sys-body-large-size));
  letter-spacing: var(--mat-option-label-text-tracking, var(--mat-sys-label-large-tracking));
  font-weight: var(--mat-option-label-text-weight, var(--mat-sys-body-large-weight));
}
.mat-mdc-option:hover:not(.mdc-list-item--disabled) {
  background-color: var(--mat-option-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {
  background-color: var(--mat-option-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));
  outline: 0;
}
.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {
  background-color: var(--mat-option-selected-state-layer-color, var(--mat-sys-secondary-container));
}
.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {
  color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-option .mat-pseudo-checkbox {
  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-option.mdc-list-item {
  align-items: center;
  background: transparent;
}
.mat-mdc-option.mdc-list-item--disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {
  opacity: 0.38;
}
.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 32px;
}
[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 16px;
  padding-right: 32px;
}
.mat-mdc-option .mat-icon,
.mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-icon,
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 0;
  margin-left: 16px;
}
.mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-left: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-right: 16px;
  margin-left: 0;
}
.mat-mdc-option .mat-mdc-option-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-option .mdc-list-item__primary-text {
  white-space: normal;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  margin-right: auto;
}
[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {
  margin-right: 0;
  margin-left: auto;
}
@media (forced-colors: active) {
  .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  [dir=rtl] .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-option-multiple {
  --mat-list-list-item-selected-container-color: var(--mat-list-list-item-container-color, transparent);
}

.mat-mdc-option-active .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})}return o})();function Hi(o,t,e){if(e.length){let i=t.toArray(),n=e.toArray(),r=0;for(let s=0;s<o+1;s++)i[s].group&&i[s].group===n[r]&&r++;return r}return 0}function Yi(o,t,e,i){return o<e?o:o+t>e+i?Math.max(0,o-i+t):e}var ji=(()=>{class o{static \u0275fac=function(i){return new(i||o)};static \u0275mod=fe({type:o});static \u0275inj=se({imports:[Ua]})}return o})();var mt=(()=>{class o{static \u0275fac=function(i){return new(i||o)};static \u0275mod=fe({type:o});static \u0275inj=se({imports:[jv,ji,le,Ua]})}return o})();var _n=["trigger"],gn=["panel"],vn=[[["mat-select-trigger"]],"*"],yn=["mat-select-trigger","*"];function bn(o,t){if(o&1&&(Us(0,"span",4),Qw(1),Ku()),o&2){let e=ww();Qs(),Og(e.placeholder);}}function Cn(o,t){o&1&&zn(0);}function wn(o,t){if(o&1&&(Us(0,"span",11),Qw(1),Ku()),o&2){let e=ww(2);Qs(),Og(e.triggerValue);}}function Sn(o,t){if(o&1&&(Us(0,"span",5),ra(1,Cn,1,0)(2,wn,2,1,"span",11),Ku()),o&2){let e=ww();Qs(),oa(e.customTrigger?1:2);}}function kn(o,t){if(o&1){let e=yw();Us(0,"div",12,1),Gn("keydown",function(n){bp(e);let r=ww();return Dp(r._handleKeydown(n))}),zn(2,1),Ku();}if(o&2){let e=ww();Qu(e.panelClass),We$1("mat-select-panel-animations-enabled",!e._animationsDisabled)("mat-primary",e._parentFormField?.color==="primary")("mat-accent",e._parentFormField?.color==="accent")("mat-warn",e._parentFormField?.color==="warn")("mat-undefined",!e._parentFormField?.color),Bn("id",e.id+"-panel")("aria-multiselectable",e.multiple)("aria-label",e.ariaLabel||null)("aria-labelledby",e._getPanelAriaLabelledby());}}var xn=new g("mat-select-scroll-strategy",{providedIn:"root",factory:()=>{let o=h(Y);return ()=>Se(o)}}),On=new g("MAT_SELECT_CONFIG"),Rn=new g("MatSelectTrigger"),_t=class{source;value;constructor(t,e){this.source=t,this.value=e;}},Ui=(()=>{class o{_viewportRuler=h(te);_changeDetectorRef=h(rd);_elementRef=h(re);_dir=h(nS,{optional:true});_idGenerator=h(Zd);_renderer=h(lt$1);_parentFormField=h(yt,{optional:true});ngControl=h(Kt,{self:true,optional:true});_liveAnnouncer=h(GM);_defaultOptions=h(On,{optional:true});_animationsDisabled=$r();_popoverLocation;_initialized=new G;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"}];_scrollOptionIntoView(e){let i=this.options.toArray()[e];if(i){let n=this.panel.nativeElement,r=Hi(e,this.options,this.optionGroups),s=i._getHostElement();e===0&&r===1?n.scrollTop=0:n.scrollTop=Yi(s.offsetTop,s.offsetHeight,n.scrollTop,n.offsetHeight);}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0);}_getChangeEvent(e){return new _t(this,e)}_scrollStrategyFactory=h(xn);_panelOpen=false;_compareWith=(e,i)=>e===i;_uid=this._idGenerator.getId("mat-select-");_triggerAriaLabelledBy=null;_previousControl;_destroy=new G;_errorStateTracker;stateChanges=new G;disableAutomaticLabeling=true;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId("mat-select-value-");_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||"";get focused(){return this._focused||this._panelOpen}_focused=false;controlType="mat-select";trigger;panel;_overlayDir;panelClass;disabled=false;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e);}_disableRipple=de(false);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties();}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??false;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next();}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(Td.required)??false}set required(e){this._required=e,this.stateChanges.next();}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e;}_multiple=false;disableOptionCentering=this._defaultOptions?.disableOptionCentering??false;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection();}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e);}_value;ariaLabel="";ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e;}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next();}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e;}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<"u"?this._defaultOptions.panelWidth:"auto";canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??false;optionSelectionChanges=bb(()=>{let e=this.options;return e?e.changes.pipe(Sb(e),$f(()=>Db(...e.map(i=>i.onSelectionChange)))):this._initialized.pipe($f(()=>this.optionSelectionChanges))});openedChange=new ee;_openedStream=this.openedChange.pipe(mt$1(e=>e),ce(()=>{}));_closedStream=this.openedChange.pipe(mt$1(e=>!e),ce(()=>{}));selectionChange=new ee;valueChange=new ee;constructor(){let e=h(fi),i=h(CM,{optional:true}),n=h(FM,{optional:true}),r=h(new $g("tabindex"),{optional:true}),s=h(ke,{optional:true});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new Pe(e,this.ngControl,n,i,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=r==null?0:parseInt(r)||0,this._popoverLocation=s?.usePopover===false?null:"inline",this.id=this.id;}ngOnInit(){this._selectionModel=new ve(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(mc(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges());});}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(mc(this._destroy)).subscribe(e=>{e.added.forEach(i=>i.select()),e.removed.forEach(i=>i.deselect());}),this.options.changes.pipe(Sb(null),mc(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection();});}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),i=this.ngControl;if(e!==this._triggerAriaLabelledBy){let n=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?n.setAttribute("aria-labelledby",e):n.removeAttribute("aria-labelledby");}i&&(this._previousControl!==i.control&&(this._previousControl!==void 0&&i.disabled!==null&&i.disabled!==this.disabled&&(this.disabled=i.disabled),this._previousControl=i.control),this.updateErrorState());}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass));}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete();}toggle(){this.panelOpen?this.close():this.open();}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._panelOpen=true,this._overlayDir.positionChange.pipe(uc(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled();}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(true)));}close(){this._panelOpen&&(this._panelOpen=false,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?"rtl":"ltr"),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(false)));}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{i(),clearTimeout(n),this._cleanupDetach=void 0;};let e=this.panel.nativeElement,i=this._renderer.listen(e,"animationend",r=>{r.animationName==="_mat-select-exit"&&(this._cleanupDetach?.(),this._detachOverlay());}),n=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay();},200);e.classList.add("mat-select-panel-exit");}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck();}writeValue(e){this._assignValue(e);}registerOnChange(e){this._onChange=e;}registerOnTouched(e){this._onTouched=e;}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next();}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return "";if(this._multiple){let e=this._selectionModel.selected.map(i=>i.viewValue);return this._isRtl()&&e.reverse(),e.join(", ")}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState();}_isRtl(){return this._dir?this._dir.value==="rtl":false}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e));}_handleClosedKeydown(e){let i=e.keyCode,n=i===40||i===38||i===37||i===39,r=i===13||i===32,s=this._keyManager;if(!s.isTyping()&&r&&!Cv(e)||(this.multiple||e.altKey)&&n)e.preventDefault(),this.open();else if(!this.multiple){let l=this.selected;s.onKeydown(e);let c=this.selected;c&&l!==c&&this._liveAnnouncer.announce(c.viewValue,1e4);}}_handleOpenKeydown(e){let i=this._keyManager,n=e.keyCode,r=n===40||n===38,s=i.isTyping();if(r&&e.altKey)e.preventDefault(),this.close();else if(!s&&(n===13||n===32)&&i.activeItem&&!Cv(e))e.preventDefault(),i.activeItem._selectViaInteraction();else if(!s&&this._multiple&&n===65&&e.ctrlKey){e.preventDefault();let l=this.options.some(c=>!c.disabled&&!c.selected);this.options.forEach(c=>{c.disabled||(l?c.select():c.deselect());});}else {let l=i.activeItemIndex;i.onKeydown(e),this._multiple&&r&&e.shiftKey&&i.activeItem&&i.activeItemIndex!==l&&i.activeItem._selectViaInteraction();}}_handleOverlayKeydown(e){e.keyCode===27&&!Cv(e)&&(e.preventDefault(),this.close());}_onFocus(){this.disabled||(this._focused=true,this.stateChanges.next());}_onBlur(){this._focused=false,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next());}get empty(){return !this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next();});}_setSelectionByValue(e){if(this.options.forEach(i=>i.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)e.forEach(i=>this._selectOptionByValue(i)),this._sortValues();else {let i=this._selectOptionByValue(e);i?this._keyManager.updateActiveItem(i):this.panelOpen||this._keyManager.updateActiveItem(-1);}this._changeDetectorRef.markForCheck();}_selectOptionByValue(e){let i=this.options.find(n=>{if(this._selectionModel.isSelected(n))return  false;try{return (n.value!=null||this.canSelectNullableOptions)&&this._compareWith(n.value,e)}catch{return  false}});return i&&this._selectionModel.select(i),i}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,true):false}_skipPredicate=e=>this.panelOpen?false:e.disabled;_getOverlayWidth(e){return this.panelWidth==="auto"?(e instanceof ae?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?"":this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck();}_initKeyManager(){this._keyManager=new Wd(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?"rtl":"ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close());}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction();});}_resetOptions(){let e=Db(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(mc(e)).subscribe(i=>{this._onSelect(i.source,i.isUserInput),i.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus());}),Db(...this.options.map(i=>i._stateChanges)).pipe(mc(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next();});}_onSelect(e,i){let n=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(n!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),i&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),i&&this.focus())),n!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next();}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((i,n)=>this.sortComparator?this.sortComparator(i,n,e):e.indexOf(i)-e.indexOf(n)),this.stateChanges.next();}}_propagateChanges(e){let i;this.multiple?i=this.selected.map(n=>n.value):i=this.selected?this.selected.value:e,this._value=i,this.valueChange.emit(i),this._onChange(i),this.selectionChange.emit(this._getChangeEvent(i)),this._changeDetectorRef.markForCheck();}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let i=0;i<this.options.length;i++)if(!this.options.get(i).disabled){e=i;break}this._keyManager.setActiveItem(e);}else this._keyManager.setActiveItem(this._selectionModel.selected[0]);}_canOpen(){return !this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e);}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,i=e?e+" ":"";return this.ariaLabelledby?i+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||"";return this.ariaLabelledby&&(e+=" "+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let i=this._elementRef.nativeElement;e.length?i.setAttribute("aria-describedby",e.join(" ")):i.removeAttribute("aria-describedby");}onContainerClick(e){let i=qe(e);i&&(i.tagName==="MAT-OPTION"||i.classList.contains("cdk-overlay-backdrop")||i.closest(".mat-mdc-select-panel"))||(this.focus(),this.open());}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static \u0275fac=function(i){return new(i||o)};static \u0275cmp=ut$1({type:o,selectors:[["mat-select"]],contentQueries:function(i,n,r){if(i&1&&_g(r,Rn,5)(r,le,5)(r,ft,5),i&2){let s;Mw(s=Sw())&&(n.customTrigger=s.first),Mw(s=Sw())&&(n.options=s),Mw(s=Sw())&&(n.optionGroups=s);}},viewQuery:function(i,n){if(i&1&&Eg(_n,5)(gn,5)(Ge,5),i&2){let r;Mw(r=Sw())&&(n.trigger=r.first),Mw(r=Sw())&&(n.panel=r.first),Mw(r=Sw())&&(n._overlayDir=r.first);}},hostAttrs:["role","combobox","aria-haspopup","listbox",1,"mat-mdc-select"],hostVars:21,hostBindings:function(i,n){i&1&&Gn("keydown",function(s){return n._handleKeydown(s)})("focus",function(){return n._onFocus()})("blur",function(){return n._onBlur()}),i&2&&(Bn("id",n.id)("tabindex",n.disabled?-1:n.tabIndex)("aria-controls",n.panelOpen?n.id+"-panel":null)("aria-expanded",n.panelOpen)("aria-label",n.ariaLabel||null)("aria-required",n.required.toString())("aria-disabled",n.disabled.toString())("aria-invalid",n.errorState)("aria-activedescendant",n._getAriaActiveDescendant()),We$1("mat-mdc-select-disabled",n.disabled)("mat-mdc-select-invalid",n.errorState)("mat-mdc-select-required",n.required)("mat-mdc-select-empty",n.empty)("mat-mdc-select-multiple",n.multiple)("mat-select-open",n.panelOpen));},inputs:{userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],panelClass:"panelClass",disabled:[2,"disabled","disabled",Tt],disableRipple:[2,"disableRipple","disableRipple",Tt],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:Xg(e)],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",Tt],placeholder:"placeholder",required:[2,"required","required",Tt],multiple:[2,"multiple","multiple",Tt],disableOptionCentering:[2,"disableOptionCentering","disableOptionCentering",Tt],compareWith:"compareWith",value:"value",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],errorStateMatcher:"errorStateMatcher",typeaheadDebounceInterval:[2,"typeaheadDebounceInterval","typeaheadDebounceInterval",Xg],sortComparator:"sortComparator",id:"id",panelWidth:"panelWidth",canSelectNullableOptions:[2,"canSelectNullableOptions","canSelectNullableOptions",Tt]},outputs:{openedChange:"openedChange",_openedStream:"opened",_closedStream:"closed",selectionChange:"selectionChange",valueChange:"valueChange"},exportAs:["matSelect"],features:[dt$1([{provide:vt,useExisting:o},{provide:ut,useExisting:o}]),It],ngContentSelectors:yn,decls:11,vars:10,consts:[["fallbackOverlayOrigin","cdkOverlayOrigin","trigger",""],["panel",""],["cdk-overlay-origin","",1,"mat-mdc-select-trigger",3,"click"],[1,"mat-mdc-select-value"],[1,"mat-mdc-select-placeholder","mat-mdc-select-min-line"],[1,"mat-mdc-select-value-text"],[1,"mat-mdc-select-arrow-wrapper"],[1,"mat-mdc-select-arrow"],["viewBox","0 0 24 24","width","24px","height","24px","focusable","false","aria-hidden","true"],["d","M7 10l5 5 5-5z"],["cdk-connected-overlay","","cdkConnectedOverlayHasBackdrop","","cdkConnectedOverlayBackdropClass","cdk-overlay-transparent-backdrop",3,"detach","backdropClick","overlayKeydown","cdkConnectedOverlayDisableClose","cdkConnectedOverlayPanelClass","cdkConnectedOverlayScrollStrategy","cdkConnectedOverlayOrigin","cdkConnectedOverlayPositions","cdkConnectedOverlayWidth","cdkConnectedOverlayFlexibleDimensions","cdkConnectedOverlayUsePopover"],[1,"mat-mdc-select-min-line"],["role","listbox","tabindex","-1",1,"mat-mdc-select-panel","mdc-menu-surface","mdc-menu-surface--open",3,"keydown"]],template:function(i,n){if(i&1&&(ia(vn),Us(0,"div",2,0),Gn("click",function(){return n.open()}),Us(3,"div",3),ra(4,bn,2,1,"span",4)(5,Sn,3,1,"span",5),Ku(),Us(6,"div",6)(7,"div",7),Op(),Us(8,"svg",8),mg(9,"path",9),Ku()()()(),dg(10,kn,3,16,"ng-template",10),Gn("detach",function(){return n.close()})("backdropClick",function(){return n.close()})("overlayKeydown",function(s){return n._handleOverlayKeydown(s)})),i&2){let r=xw(1);Qs(3),Bn("id",n._valueId),Qs(),oa(n.empty?4:5),Qs(6),hg("cdkConnectedOverlayDisableClose",true)("cdkConnectedOverlayPanelClass",n._overlayPanelClass)("cdkConnectedOverlayScrollStrategy",n._scrollStrategy)("cdkConnectedOverlayOrigin",n._preferredOverlayOrigin||r)("cdkConnectedOverlayPositions",n._positions)("cdkConnectedOverlayWidth",n._overlayWidth)("cdkConnectedOverlayFlexibleDimensions",true)("cdkConnectedOverlayUsePopover",n._popoverLocation);}},dependencies:[ae,Ge],styles:[`@keyframes _mat-select-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-select-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-select {
  display: inline-block;
  width: 100%;
  outline: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--mat-select-enabled-trigger-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-select-trigger-text-font, var(--mat-sys-body-large-font));
  line-height: var(--mat-select-trigger-text-line-height, var(--mat-sys-body-large-line-height));
  font-size: var(--mat-select-trigger-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-select-trigger-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-select-trigger-text-tracking, var(--mat-sys-body-large-tracking));
}

div.mat-mdc-select-panel {
  box-shadow: var(--mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}

.mat-mdc-select-disabled {
  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-select-disabled .mat-mdc-select-placeholder {
  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-select-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.mat-mdc-select-disabled .mat-mdc-select-trigger {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

.mat-mdc-select-value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mat-mdc-select-value-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mat-mdc-select-arrow-wrapper {
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {
  transform: none;
}

.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,
.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {
  color: var(--mat-select-invalid-arrow-color, var(--mat-sys-error));
}

.mat-mdc-select-arrow {
  width: 10px;
  height: 5px;
  position: relative;
  color: var(--mat-select-enabled-arrow-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
  color: var(--mat-select-focused-arrow-color, var(--mat-sys-primary));
}
.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {
  color: var(--mat-select-disabled-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-select-open .mat-mdc-select-arrow {
  transform: rotate(180deg);
}
.mat-form-field-animations-enabled .mat-mdc-select-arrow {
  transition: transform 80ms linear;
}
.mat-mdc-select-arrow svg {
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (forced-colors: active) {
  .mat-mdc-select-arrow svg {
    fill: CanvasText;
  }
  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {
    fill: GrayText;
  }
}

div.mat-mdc-select-panel {
  width: 100%;
  max-height: 275px;
  outline: 0;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  transform-origin: top center;
  border-radius: 0 0 4px 4px;
  position: relative;
  background-color: var(--mat-select-panel-background-color, var(--mat-sys-surface-container));
}
.mat-mdc-select-panel-above div.mat-mdc-select-panel {
  border-radius: 4px 4px 0 0;
  transform-origin: bottom center;
}
@media (forced-colors: active) {
  div.mat-mdc-select-panel {
    outline: solid 1px;
  }
}

.mat-select-panel-animations-enabled {
  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);
}
.mat-select-panel-animations-enabled.mat-select-panel-exit {
  animation: _mat-select-exit 100ms linear;
}

.mat-mdc-select-placeholder {
  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--mat-select-placeholder-text-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {
  transition: none;
}
.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
  transition: none;
  display: block;
}

.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {
  cursor: pointer;
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {
  max-width: calc(100% - 18px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {
  max-width: calc(100% / 0.75 - 24px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {
  max-width: calc(100% - 60px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {
  max-width: calc(100% - 24px);
}

.mat-mdc-select-min-line:empty::before {
  content: " ";
  white-space: pre;
  width: 1px;
  display: inline-block;
  visibility: hidden;
}

.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {
  transform: var(--mat-select-arrow-transform, translateY(-8px));
}
`],encapsulation:2})}return o})();var Ki=(()=>{class o{static \u0275fac=function(i){return new(i||o)};static \u0275mod=fe({type:o});static \u0275inj=se({imports:[ht,mt,Ua,Be,F,mt]})}return o})();function Dn(o,t){if(o&1&&(Us(0,"mat-option",9),Qw(1),Ku()),o&2){let e=t.$implicit;hg("value",e),Qs(),Og(e);}}var Zi=class o{store=h(y);builder=h(zU);currencies=["INR","USD","EUR","GBP","AED"];profile=this.store.profile();form=this.builder.nonNullable.group({name:[this.profile.name,Td.required],salary:[this.profile.salary,[Td.required,Td.min(0)]],salaryCreditDay:[this.profile.salaryCreditDay,[Td.required,Td.min(1),Td.max(31)]],preferredCurrency:[this.profile.preferredCurrency,Td.required],familySize:[this.profile.familySize??1,[Td.min(1)]],notificationTimes:[this.profile.notificationTimes.join(", "),Td.required],financialPreferences:[this.profile.financialPreferences]});save(){let t=this.form.getRawValue();this.store.saveProfile({id:this.profile.id,name:t.name,salary:t.salary,salaryCreditDay:t.salaryCreditDay,preferredCurrency:t.preferredCurrency,familySize:t.familySize,notificationTimes:t.notificationTimes.split(",").map(e=>e.trim()).filter(Boolean),financialPreferences:t.financialPreferences});}static \u0275fac=function(e){return new(e||o)};static \u0275cmp=ut$1({type:o,selectors:[["app-profile-setup-page"]],decls:41,vars:2,consts:[[1,"page-header"],[1,"panel","form-card"],[3,"ngSubmit","formGroup"],[1,"form-grid"],["appearance","outline"],["matInput","","formControlName","name"],["matInput","","type","number","formControlName","salary"],["matInput","","type","number","formControlName","salaryCreditDay"],["formControlName","preferredCurrency"],[3,"value"],["matInput","","type","number","formControlName","familySize"],["matInput","","formControlName","notificationTimes"],["appearance","outline",1,"wide"],["matInput","","rows","4","formControlName","financialPreferences"],["mat-flat-button","","type","submit",3,"disabled"]],template:function(e,i){e&1&&(Us(0,"header",0)(1,"div")(2,"h1"),Qw(3,"Profile setup"),Ku(),Us(4,"p"),Qw(5,"These details shape planning defaults and reminders."),Ku()()(),Us(6,"mat-card",1)(7,"form",2),Gn("ngSubmit",function(){return i.save()}),Us(8,"div",3)(9,"mat-form-field",4)(10,"mat-label"),Qw(11,"Name"),Ku(),mg(12,"input",5),rI(),Ku(),Us(13,"mat-form-field",4)(14,"mat-label"),Qw(15,"Salary"),Ku(),mg(16,"input",6),rI(),Ku(),Us(17,"mat-form-field",4)(18,"mat-label"),Qw(19,"Salary credit day"),Ku(),mg(20,"input",7),rI(),Ku(),Us(21,"mat-form-field",4)(22,"mat-label"),Qw(23,"Preferred currency"),Ku(),Us(24,"mat-select",8),uw(25,Dn,2,2,"mat-option",9,lw),Ku(),rI(),Ku(),Us(27,"mat-form-field",4)(28,"mat-label"),Qw(29,"Family size"),Ku(),mg(30,"input",10),rI(),Ku(),Us(31,"mat-form-field",4)(32,"mat-label"),Qw(33,"Notification times"),Ku(),mg(34,"input",11),rI(),Ku()(),Us(35,"mat-form-field",12)(36,"mat-label"),Qw(37,"Financial preferences"),Ku(),mg(38,"textarea",13),rI(),Ku(),Us(39,"button",14),Qw(40,"Save profile"),Ku()()()),e&2&&(Qs(7),hg("formGroup",i.form),Qs(5),iI(),Qs(4),iI(),Qs(4),iI(),Qs(4),iI(),Qs(),dw(i.currencies),Qs(5),iI(),Qs(4),iI(),Qs(4),iI(),Qs(),hg("disabled",i.form.invalid));},dependencies:[Z3,q3,Bt,Ot,F,mi,ze$1,Ke,Ge$1,Ki,Ui,le,WU,GU,qy,SM,HU,UU,FM,OM],styles:[".form-card[_ngcontent-%COMP%]{padding:clamp(16px,3vw,28px)}.form-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.wide[_ngcontent-%COMP%]{width:100%}"]})};export{Zi as ProfileSetupPage};