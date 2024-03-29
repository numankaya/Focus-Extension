console.log("1?");

/**
 * Jeeliz Glance Tracker - https://github.com/jeeliz/jeelizGlanceTracker
 *
 * Copyright 2020 WebAR.rocks ( https://webar.rocks )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var JEELIZGLANCETRACKER = (function () {
  function ia(b, e, c) {
    var m = new XMLHttpRequest();
    m.open("GET", b, !0);
    m.withCredentials = !1;
    m.onreadystatechange = function () {
      4 === m.readyState &&
        (200 === m.status || 0 === m.status
          ? e(m.responseText)
          : "undefined" !== typeof c && c(m.status));
    };
    m.send();
  }
  function ja(b) {
    return new Promise(function (e, c) {
      ia(b, e, c);
    });
  }
  function ma(b, e) {
    if (0 === e || "object" !== typeof b) return b;
    b = Object.assign({}, b);
    e = void 0 === e || -1 === e ? -1 : e - 1;
    for (var c in b) b[c] = ma(b[c], e);
    return b;
  }
  function sa(b) {
    switch (b) {
      case "relu":
        return "gl_FragColor=max(vec4(0.,0.,0.,0.),gl_FragColor);";
      case "elu":
        return "gl_FragColor=mix(exp(-abs(gl_FragColor))-vec4(1.,1.,1.,1.),gl_FragColor,step(0.,gl_FragColor));";
      case "elu01":
        return "gl_FragColor=mix(0.1*exp(-abs(gl_FragColor))-vec4(0.1,0.1,0.1,0.1),gl_FragColor,step(0.,gl_FragColor));";
      case "arctan":
        return "gl_FragColor=atan(3.14159265359*texture2D(u0,vUV))/3.14159265359;";
      case "copy":
        return "";
      default:
        return !1;
    }
  }
  function ua(b, e) {
    var c = e % 8;
    return (b[(e - c) / 8] >> (7 - c)) & 1;
  }
  function Aa(b, e, c) {
    var m = 1,
      y = 0;
    for (c = e + c - 1; c >= e; --c) (y += m * ua(b, c)), (m *= 2);
    return y;
  }
  function Ea(b) {
    b = b.data;
    b =
      "undefined" === typeof btoa
        ? Buffer.from(b, "base64").toString("latin1")
        : atob(b);
    for (var e = b.length, c = new Uint8Array(e), m = 0; m < e; ++m)
      c[m] = b.charCodeAt(m);
    return c;
  }
  function Fa(b) {
    return "string" === typeof b ? JSON.parse(b) : b;
  }
  function Ga(b) {
    if ("undefined" === typeof Fa(b).nb) {
      var e = Fa(b);
      b = e.ne;
      var c = e.nf,
        m = e.n;
      e = Ea(e);
      for (
        var y = new Float32Array(m),
          l = new Float32Array(c),
          t = b + c + 1,
          q = 0;
        q < m;
        ++q
      ) {
        var n = t * q,
          p = 0 === ua(e, n) ? 1 : -1,
          x = Aa(e, n + 1, b);
        n = n + 1 + b;
        for (var A = l.length, u = 0, D = n; D < n + A; ++D)
          (l[u] = ua(e, D)), ++u;
        for (A = n = 0; A < c; ++A) n += l[A] * Math.pow(2, -A - 1);
        y[q] =
          0 === n && 0 === x
            ? 0
            : p * (1 + n) * Math.pow(2, 1 + x - Math.pow(2, b - 1));
      }
      b = y;
    } else if (((m = Fa(b)), (b = m.nb), 0 === b)) b = new Uint8Array(m.nb);
    else {
      c = m.n;
      m = Ea(m);
      e = new Uint32Array(c);
      for (y = 0; y < c; ++y) e[y] = Aa(m, y * b, b);
      b = e;
    }
    return b;
  }
  var H = (function () {
      function b(h, k, d) {
        k = h.createShader(k);
        h.shaderSource(k, d);
        h.compileShader(k);
        return h.getShaderParameter(k, h.COMPILE_STATUS) ? k : null;
      }
      function e(h, k, d) {
        k = b(h, h.VERTEX_SHADER, k);
        d = b(h, h.FRAGMENT_SHADER, d);
        h === a && q.push(k, d);
        var F = h.createProgram();
        h.attachShader(F, k);
        h.attachShader(F, d);
        h.linkProgram(F);
        return F;
      }
      function c(h) {
        return ["float", "sampler2D", "int"]
          .map(function (k) {
            return "precision " + h + " " + k + ";\n";
          })
          .join("");
      }
      function m(h, k) {
        k.v = k.v ? !0 : !1;
        if (!k.v) {
          k.Ca =
            k.Ca ||
            "precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5);}";
          k.Fa = k.Fa || ["a0"];
          k.ta = k.ta || [2];
          k.precision = k.precision || u;
          k.id = x++;
          void 0 !== k.Pc &&
            (k.Pc.forEach(function (M, O) {
              k.h = k.h.replace(M, k.Za[O]);
            }),
            k.Pc.splice(0));
          k.Ub = 0;
          k.ta.forEach(function (M) {
            k.Ub += 4 * M;
          });
          var d = c(k.precision);
          k.ga = e(h, d + k.Ca, d + k.h);
          k.u = {};
          k.i.forEach(function (M) {
            k.u[M] = h.getUniformLocation(k.ga, M);
          });
          k.attributes = {};
          k.ua = [];
          k.Fa.forEach(function (M) {
            var O = h.getAttribLocation(k.ga, M);
            k.attributes[M] = O;
            k.ua.push(O);
          });
          if (k.j) {
            h.useProgram(k.ga);
            p = k;
            n = k.id;
            for (var F in k.j) h.uniform1i(k.u[F], k.j[F]);
          }
          k.fa = !0;
        }
      }
      function y(h) {
        Ha.xe(w);
        n !== h.id &&
          (w.I(),
          (n = h.id),
          (p = h),
          a.useProgram(h.ga),
          h.ua.forEach(function (k) {
            0 !== k && a.enableVertexAttribArray(k);
          }));
      }
      function l(h, k, d) {
        m(h, k, d);
        h.useProgram(k.ga);
        h.enableVertexAttribArray(k.attributes.a0);
        n = -1;
        return (p = k);
      }
      function t() {
        return {
          h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
          i: ["u1"],
          j: { u1: 0 },
        };
      }
      var q = [],
        n = -1,
        p = null,
        x = 0,
        A = !1,
        u = "highp",
        D = ["u1"],
        r = ["u0"],
        B = { u1: 0 },
        g = { u0: 0 },
        J = { u1: 0, u2: 1 },
        I = { u1: 0, u3: 1 },
        f = ["u1", "u3", "u4"],
        K = { u5: 0 },
        v = {
          s0: t(),
          s1: {
            h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
            i: D,
            j: B,
            precision: "lowp",
          },
          s2: {
            h: "uniform sampler2D u1,u2;varying vec2 vv0;void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a*b;}",
            i: ["u1", "u2"],
            j: J,
          },
          s3: {
            h: "uniform sampler2D u1;uniform vec2 u6,u7;varying vec2 vv0;void main(){vec2 a=vv0*u6+u7;gl_FragColor=texture2D(u1,a);}",
            i: ["u1", "u6", "u7"],
            j: B,
            v: !0,
          },
          s4: {
            h: "uniform sampler2D u1;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a.r*f;}",
            i: D,
            j: B,
          },
          s5: {
            h: "uniform sampler2D u1,u2;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a.a*b.r*f;}",
            i: ["u1", "u2"],
            j: J,
          },
          s6: {
            h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(1.-vv0.x,vv0.y));}",
            i: D,
            j: B,
          },
          s7: {
            h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(vv0.x,1.-vv0.y));}",
            i: D,
            j: B,
          },
          s8: {
            h: "uniform sampler2D u0;uniform float u6;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=a*u6;}",
            i: ["u0", "u6"],
            j: g,
          },
          s9: {
            h: "uniform sampler2D u0;uniform float u6;varying vec2 vv0;const vec4 f=vec4(.25,.25,.25,.25),g=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);float b=dot(a*u6,f);gl_FragColor=b*g;}",
            i: ["u0", "u6"],
            j: g,
          },
          s10: {
            h: "uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){float a=.25*dot(e,texture2D(u1,vv0));gl_FragColor=a*e;}",
            i: D,
            j: B,
          },
          s11: {
            h: "uniform sampler2D u1,u8;uniform float u9;const vec4 f=vec4(1.,1.,1.,1.);varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u8,vv0);gl_FragColor=mix(b,a,u9*f);}",
            i: ["u1", "u8", "u9"],
            j: { u1: 0, u8: 1 },
          },
          s12: {
            h: "uniform sampler2D u1;uniform vec2 u10;varying vec2 vv0;void main(){gl_FragColor=.25*(texture2D(u1,vv0+u10)+texture2D(u1,vv0+u10*vec2(1.,-1.))+texture2D(u1,vv0+u10*vec2(-1.,-1.))+texture2D(u1,vv0+u10*vec2(-1.,1.)));}",
            i: ["u1", "u10"],
            j: B,
          },
          s13: {
            h: "uniform sampler2D u1;uniform vec4 u11;varying vec2 vv0;float g(float a,float b){a=floor(a)+.5;return floor(a/exp2(b));}float h(float a,float b){return floor(a*exp2(b)+.5);}float i(float a,float b){return mod(a,h(1.,b));}float e(float c,float a,float b){a=floor(a+.5),b=floor(b+.5);return i(g(c,a),b-a);}vec4 j(float a){if(a==0.)return vec4(0.,0.,0.,0.);float k=128.*step(a,0.);a=abs(a);float c=floor(log2(a)),l=c+127.,b=(a/exp2(c)-1.)*8388608.,d=l/2.,m=fract(d)*2.,n=floor(d),o=e(b,0.,8.),p=e(b,8.,16.),q=m*128.+e(b,16.,23.),r=k+n;return vec4(o,p,q,r)/255.;}void main(){float a=dot(texture2D(u1,vv0),u11);gl_FragColor=j(a);}",
            i: ["u1", "u11"],
            j: B,
          },
          s14: {
            h: "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=e/(e+exp(-a));gl_FragColor=b;}",
            i: r,
            j: g,
            v: !0,
          },
          s15: {
            h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(0.,0.,0.,0.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=max(f,a);}",
            i: r,
            j: g,
          },
          s16: {
            h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=mix(exp(-abs(a))-f,a,step(0.,a));}",
            i: r,
            j: g,
          },
          s17: {
            h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=exp(-abs(a))-f;gl_FragColor=mix(.1*b,a,step(0.,a));}",
            i: r,
            j: g,
          },
          s18: {
            h: "uniform sampler2D u0;const float e=3.141593;varying vec2 vv0;void main(){gl_FragColor=atan(e*texture2D(u0,vv0))/e;}",
            i: r,
            j: g,
          },
          s19: {
            h: "uniform sampler2D u0;const float e=3.141593;varying vec2 vv0;void main(){gl_FragColor=2.*atan(e*texture2D(u0,vv0))/e;}",
            i: r,
            j: g,
            v: !0,
          },
          s20: {
            h: "uniform sampler2D u0,u12;uniform float u13;const vec2 e=vec2(.5,.5);const float f=1e-5;const vec4 g=vec4(1.,1.,1.,1.),i=vec4(0.,0.,0.,0.);varying vec2 vv0;void main(){vec4 a=texture2D(u12,e);float b=u13*u13;vec4 c=max(b*a,f*g);gl_FragColor=texture2D(u0,vv0)/c;}",
            i: ["u0", "u12", "u13"],
            j: { u0: 0, u12: 1 },
            v: !0,
          },
          s21: {
            h: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;void main(){float a=u14.x*u14.y;vec2 b=floor(vv0*a)/a,c=fract(vv0*a),d=floor(b*u14.y),f=floor(u14.x*fract(b*u14.y)),g=(f*u14.y+d)/a;gl_FragColor=texture2D(u1,g+c/a);}",
            i: ["u1", "u14"],
            j: B,
          },
          s22: {
            h: "uniform sampler2D u15,u16,u17;varying vec2 vv0;void main(){vec4 a=texture2D(u17,vv0);vec2 b=a.rg,c=a.ba;vec4 d=texture2D(u15,b),f=texture2D(u16,c);gl_FragColor=d*f;}",
            i: ["u15", "u16", "u17"],
            j: { u16: 0, u15: 1, u17: 2 },
            v: !0,
          },
          s23: {
            h: "uniform float u18,u19;uniform sampler2D u15,u16;varying vec2 vv0;void main(){vec2 c=fract(vv0*u18),a=vv0;float b=u18*u19;a=(.5+floor(b*vv0))/b;vec4 d=texture2D(u15,a),f=texture2D(u16,c);gl_FragColor=d*f;}",
            i: ["u16", "u15", "u18", "u19"],
            j: { u16: 0, u15: 1 },
          },
          s24: {
            h: "uniform float u18,u19;uniform sampler2D u15,u16,u20,u21,u22,u23;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(1e-3,1e-3,1e-3,1e-3);void main(){vec2 c=fract(vv0*u18),d=vv0;float h=u18*u19;d=(.5+floor(h*vv0))/h;vec4 l=texture2D(u15,d),m=texture2D(u16,c),a=texture2D(u23,d);a=floor(.5+a*255.);vec4 n=texture2D(u20,c),o=texture2D(u21,c),p=texture2D(u22,c),i=step(-g,-a),b=e-i,j=b*step(-e-g,-a);b*=e-j;vec4 k=b*step(-2.*e-g,-a);b*=e-k;vec4 q=b,r=i*m+j*n+k*o+q*p;gl_FragColor=l*r;}",
            i: "u15 u16 u18 u19 u23 u20 u21 u22".split(" "),
            j: { u16: 0, u15: 1, u23: 3, u20: 4, u21: 5, u22: 6 },
            v: !0,
          },
          s25: {
            h: "uniform sampler2D u15,u16,u3;uniform float u18,u24,u25,u19;uniform vec2 u26;varying vec2 vv0;const vec2 f=vec2(1.),l=vec2(0.);void main(){vec2 c=floor(u24*vv0),d=u24*vv0-c;float g=u18/u24;vec2 h=floor(d*g),i=d*g-h,j=(c+i)/u24;float m=u24*u19/u18;vec2 b=m*h;b=floor(u26*b+.5*(u19-1.)*(f-u26));vec2 a=(b+i*u25)/u19;a+=.25/u19;vec2 k=step(a,f)*step(l,a);vec4 n=texture2D(u15,j),o=texture2D(u16,a),p=n*o,q=texture2D(u3,j);gl_FragColor=(p*u25*u25+q)*k.x*k.y;}",
            i: "u15 u16 u18 u24 u25 u19 u3 u26".split(" "),
            j: { u16: 0, u15: 1, u3: 2 },
          },
          s26: {
            h: "uniform sampler2D u15,u16;varying vec2 vv0;void main(){vec4 a=texture2D(u15,vv0),b=texture2D(u16,vv0);gl_FragColor=a*b;}",
            i: ["u15", "u16"],
            j: { u16: 0, u15: 1 },
            v: !0,
          },
          s27: {
            h: "uniform sampler2D u1,u3;uniform float u4;varying vec2 vv0;void main(){gl_FragColor=texture2D(u3,vv0)+u4*texture2D(u1,vv0);}",
            i: f,
            j: I,
          },
          s28: {
            h: "uniform sampler2D u1,u3;uniform float u4;varying vec2 vv0;const vec4 e=vec4(1.);void main(){vec4 a=texture2D(u3,vv0)+u4*texture2D(u1,vv0);vec2 h=mod(gl_FragCoord.xy,vec2(2.)),d=step(h,vec2(.75));float b=d.x+2.*d.y,c=step(2.5,b),g=(1.-c)*step(1.5,b),i=(1.-c)*(1.-g)*step(.5,b);a=mix(a,a.argb,i*e),a=mix(a,a.barg,g*e),a=mix(a,a.gbar,c*e),gl_FragColor=a;}",
            i: f,
            j: I,
            v: !0,
          },
          s29: {
            h: "uniform sampler2D u1,u3;uniform float u4;varying vec2 vv0;const vec4 h=vec4(1.);void main(){vec4 a=texture2D(u3,vv0)+u4*texture2D(u1,vv0);vec2 b=floor(gl_FragCoord.xy);vec3 d=b.x*vec3(1.)+vec3(0.,1.,2.);float c=mod(b.y,2.);vec4 f=vec4(c,(1.-c)*step(mod(d,vec3(3.)),vec3(.5)));mat4 g=mat4(a.rgba,a.gbar,a.barg,a.argb);gl_FragColor=g*f;}",
            i: f,
            j: I,
            v: !0,
          },
          s30: {
            h: "varying vec2 vv0;uniform sampler2D u1;const vec4 f=vec4(1.,1.,1.,1.),g=vec4(.299,.587,.114,0.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=dot(a,g)*f;}",
            i: D,
            j: B,
            precision: "lowp",
          },
          s31: {
            h: "varying vec2 vv0;uniform sampler2D u1;uniform float u27;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u27)).rgb,c=texture2D(u1,vv0+vec2(u27,u27)).rgb,d=texture2D(u1,vv0+vec2(u27,0.)).rgb;gl_FragColor=vec4(dot(a,f),dot(b,f),dot(c,f),dot(d,f));}",
            i: ["u1", "u27"],
            j: B,
            precision: "lowp",
          },
          s32: {
            h: "varying vec2 vv0;uniform sampler2D u1;uniform float u27;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u27)).rgb,c=texture2D(u1,vv0+vec2(u27,u27)).rgb,d=texture2D(u1,vv0+vec2(u27,0.)).rgb;gl_FragColor=vec4(a.r,b.g,c.b,dot(d,f));}",
            i: ["u1", "u27"],
            j: B,
            precision: "lowp",
          },
          s33: {
            h: "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u28;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=vec4(0.);a-=texture2D(u1,vec2(vv0.x-u28,vv0.y-u28))*1.,a-=texture2D(u1,vec2(vv0.x-u28,vv0.y))*2.,a-=texture2D(u1,vec2(vv0.x-u28,vv0.y+u28))*1.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y-u28))*1.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y))*2.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y+u28))*1.;vec4 b=vec4(0.);b-=texture2D(u1,vec2(vv0.x-u28,vv0.y-u28))*1.,b-=texture2D(u1,vec2(vv0.x,vv0.y-u28))*2.,b-=texture2D(u1,vec2(vv0.x+u28,vv0.y-u28))*1.,b+=texture2D(u1,vec2(vv0.x-u28,vv0.y+u28))*1.,b+=texture2D(u1,vec2(vv0.x,vv0.y+u28))*2.,b+=texture2D(u1,vec2(vv0.x+u28,vv0.y+u28))*1.;vec3 c=sqrt(a.rgb*a.rgb+b.rgb*b.rgb);vec4 e=vec4(c,texture2D(u1,vv0).a),g=texture2D(u2,vv0);gl_FragColor=g.a*e.r*f;}",
            i: ["u1", "u2", "u28"],
            j: J,
            v: !0,
          },
          s34: {
            h: "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u28;const vec4 j=vec4(1.,1.,1.,1.);const vec2 k=vec2(1.,1.);void main(){float h=0.;vec2 l=k*u28,a,b;float c,d,i=0.;for(float e=-4.;e<=4.;e+=1.)for(float f=-4.;f<=4.;f+=1.)a=vec2(e,f),c=length(a)/2.,d=exp(-c*c),b=vv0+l*a,h+=d*texture2D(u1,b).r,i+=d;vec4 m=texture2D(u2,vv0);gl_FragColor=m.a*(texture2D(u1,b).r-h/i)*j;}",
            i: ["u1", "u2", "u28"],
            j: J,
            v: !0,
          },
          s35: {
            h: "uniform sampler2D u5;uniform vec2 u10;varying vec2 vv0;vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}const vec2 g=vec2(.5,.5),h=vec2(1.,0.),i=vec2(0.,1.);void main(){vec2 a=vv0-u10*g;vec4 b=texture2D(u5,a),c=texture2D(u5,a+u10*h),d=texture2D(u5,a+u10*i),j=texture2D(u5,a+u10),k=e(b,c),l=e(d,j);gl_FragColor=e(k,l);}",
            i: ["u5", "u10"],
            j: K,
          },
          s36: {
            h: "uniform sampler2D u5;uniform vec2 u10;varying vec2 vv0;const vec2 k=vec2(1.,0.),l=vec2(0.,1.),m=vec2(2.,0.),n=vec2(0.,2.);vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}vec4 f(vec2 a){vec4 b=texture2D(u5,a),c=texture2D(u5,a+u10*k),d=texture2D(u5,a+u10*l),g=texture2D(u5,a+u10),h=e(b,c),i=e(d,g);return e(h,i);}void main(){vec2 a=vv0+u10*vec2(-.55,-1.05);vec4 b=f(a),c=f(a+u10*m),d=f(a+u10*2.),g=f(a+u10*n),h=e(b,c),i=e(d,g);gl_FragColor=e(h,i);}",
            i: ["u5", "u10"],
            j: K,
            v: !0,
          },
          s37: {
            h: "uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a*a;}",
            i: ["u1"],
            j: B,
            precision: "lowp",
            v: !0,
          },
          s38: {
            h: "uniform sampler2D u1;uniform vec2 u10;varying vec2 vv0;const float e=15444.;void main(){vec4 a=1001./e*texture2D(u1,vv0-3.*u10)+2002./e*texture2D(u1,vv0-2.*u10)+3003./e*texture2D(u1,vv0-u10)+3432./e*texture2D(u1,vv0)+3003./e*texture2D(u1,vv0+u10)+2002./e*texture2D(u1,vv0+2.*u10)+1001./e*texture2D(u1,vv0+3.*u10);gl_FragColor=a;}",
            i: ["u10", "u1"],
            j: B,
            precision: "lowp",
            v: !0,
          },
          s39: {
            h: "uniform sampler2D u1,u12,u29;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);const float g=.1;void main(){vec4 a=texture2D(u12,vv0),b=texture2D(u29,vv0),c=texture2D(u1,vv0),d=max(f*g,b-a*a),h=sqrt(d);gl_FragColor=(c-a)/h;}",
            i: ["u1", "u12", "u29"],
            j: { u1: 0, u12: 1, u29: 2 },
            v: !0,
          },
        },
        E = {
          s40: {
            h: "uniform float u18,u30;uniform sampler2D u15,u16,u3;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(1e-5,1e-5);void main(){vec4 sum=texture2D(u3,vv0);float toSparsity=1.1111;vec2 uvFrom,uvWeight,xyPatch=ZERO2,eps2=EPS2/u18,xyTo=floor(vv0*u18+eps2);float weightSize=toSparsity*u18;vec2 halfFromSparsity=ONE2*(toSparsity-1.)/2.;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.)xyPatch.y=patch_y,uvFrom=(xyTo+HALF2+u30*(xyPatch-halfFromSparsity))/u18,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),uvWeight=(xyTo*toSparsity+xyPatch+HALF2)/weightSize,sum+=texture2D(u15,uvWeight)*texture2D(u16,uvFrom);}gl_FragColor=sum,gl_FragColor*=2.2222;}",
            i: ["u18", "u15", "u16", "u3", "u30"],
            Za: ["1.1111", "gl_FragColor\\*=2.2222;"],
          },
          s41: {
            h: "uniform float u18,u30,u19;uniform sampler2D u15,u16,u3;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(1e-4,1e-4);void main(){vec4 sum=texture2D(u3,vv0);float fromSparsity=1.1111,shrinkFactor=3.3333;vec2 uvFrom,uvWeight,xyFrom,xyPatchTo,xyPatch=ZERO2,xyShrink=ZERO2,eps2=EPS2/u19,xyTo=floor(vv0*u18+eps2);float weightSize=fromSparsity*u19;vec2 halfFromSparsity=ONE2*(fromSparsity-1.)/2.;float toSparsity=weightSize/u18;vec2 xyFrom0=xyTo*shrinkFactor;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.){xyPatch.y=patch_y;for(float shrink_x=0.;shrink_x<3.3333;shrink_x+=1.){xyShrink.x=shrink_x;for(float shrink_y=0.;shrink_y<3.3333;shrink_y+=1.)xyShrink.y=shrink_y,xyFrom=xyFrom0+xyShrink+shrinkFactor*u30*(xyPatch-halfFromSparsity),uvFrom=(xyFrom+HALF2)/u19,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),xyPatchTo=xyPatch*shrinkFactor+xyShrink,uvWeight=(xyTo*toSparsity+xyPatchTo+HALF2)/weightSize,sum+=texture2D(u15,uvWeight)*texture2D(u16,uvFrom);}}}gl_FragColor=sum,gl_FragColor*=2.2222;}",
            i: "u18 u19 u15 u16 u3 u30".split(" "),
            Za: ["1.1111", "gl_FragColor\\*=2.2222;", "3.3333"],
          },
        },
        C = null,
        L = null,
        w = {
          Sa: function () {
            return A;
          },
          s: function () {
            if (!A) {
              C = ma(v, 2);
              L = ma(E, 2);
              u = "highp";
              a.getShaderPrecisionFormat &&
                (a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.MEDIUM_FLOAT),
                a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.LOW_FLOAT));
              for (var h in C) m(a, C[h], h);
              H.set("s0");
              a.enableVertexAttribArray(0);
              A = !0;
            }
          },
          Da: function (h) {
            h.forEach(function (k) {
              w.$b(k);
            });
          },
          $b: function (h) {
            C[h.id] = h;
            m(a, h, h.id);
          },
          Ld: function (h, k, d) {
            k || (k = h);
            C[k] = Object.create(L[h]);
            C[k].Sd = !0;
            L[h].Za &&
              L[h].Za.forEach(function (F, M) {
                C[k].h = C[k].h.replace(new RegExp(F, "g"), d[M]);
              });
            m(a, C[k], k);
          },
          set: function (h) {
            var k = C[h];
            k.v && ((k.v = !1), m(a, k, h));
            y(k);
          },
          za: function (h) {
            return l(h, t(), "s42");
          },
          Mb: function (h) {
            return l(
              h,
              {
                h: "void main(){gl_FragColor=vec4(.5,.5,.5,.5);}",
                i: [],
                precision: u,
              },
              "s43"
            );
          },
          yd: function (h) {
            return "undefined" === typeof C[h] ? !1 : C[h].fa;
          },
          I: function () {
            -1 !== n &&
              ((n = -1),
              p.ua.forEach(function (h) {
                0 !== h && a.disableVertexAttribArray(h);
              }));
          },
          Nb: function () {
            var h = 0;
            p.ua.forEach(function (k, d) {
              d = p.ta[d];
              a.vertexAttribPointer(k, d, a.FLOAT, !1, p.Ub, h);
              h += 4 * d;
            });
          },
          xd: function () {
            a.enableVertexAttribArray(0);
          },
          Aa: function () {
            w.$a(a);
          },
          $a: function (h) {
            h.vertexAttribPointer(p.ua[0], 2, h.FLOAT, !1, 8, 0);
          },
          Tf: function (h, k) {
            a.uniform1i(p.u[h], k);
          },
          P: function (h, k) {
            a.uniform1f(p.u[h], k);
          },
          K: function (h, k, d) {
            a.uniform2f(p.u[h], k, d);
          },
          ye: function (h, k) {
            a.uniform2fv(p.u[h], k);
          },
          ze: function (h, k) {
            a.uniform3fv(p.u[h], k);
          },
          Uf: function (h, k, d, F) {
            a.uniform3f(p.u[h], k, d, F);
          },
          Ae: function (h, k, d, F, M) {
            a.uniform4f(p.u[h], k, d, F, M);
          },
          Uc: function (h, k) {
            a.uniform4fv(p.u[h], k);
          },
          Vf: function (h, k) {
            a.uniformMatrix2fv(p.u[h], !1, k);
          },
          Wf: function (h, k) {
            a.uniformMatrix3fv(p.u[h], !1, k);
          },
          Xf: function (h, k) {
            a.uniformMatrix4fv(p.u[h], !1, k);
          },
          Z: function (h, k) {
            w.set(h);
            k.forEach(function (d) {
              switch (d.type) {
                case "4f":
                  a.uniform4fv(p.u[d.name], d.value);
                  break;
                case "3f":
                  a.uniform3fv(p.u[d.name], d.value);
                  break;
                case "2f":
                  a.uniform2fv(p.u[d.name], d.value);
                  break;
                case "1f":
                  a.uniform1f(p.u[d.name], d.value);
                  break;
                case "1i":
                  a.uniform1i(p.u[d.name], d.value);
                  break;
                case "mat2":
                  a.uniformMatrix2fv(p.u[d.name], !1, d.value);
                  break;
                case "mat3":
                  a.uniformMatrix3fv(p.u[d.name], !1, d.value);
                  break;
                case "mat4":
                  a.uniformMatrix4fv(p.u[d.name], !1, d.value);
              }
            });
          },
          rf: function () {
            return "lowp";
          },
          m: function () {
            w.I();
            a.disableVertexAttribArray(0);
            for (var h in C) {
              var k = C[h];
              k.fa && ((k.fa = !1), a.deleteProgram(k.ga));
              k.Sd && delete C[h];
            }
            q.forEach(function (d) {
              a.deleteShader(d);
            });
            q.splice(0);
            x = 0;
            A = !1;
            p = null;
            n = -1;
          },
        };
      return w;
    })(),
    a = null,
    Ma = (function () {
      function b(r) {
        console.log("ERROR in ContextFF: ", r);
        return !1;
      }
      function e() {
        return (
          navigator.userAgent &&
          -1 !== navigator.userAgent.indexOf("forceWebGL1")
        );
      }
      function c(r, B, g) {
        r.setAttribute("width", B);
        r.setAttribute("height", g);
      }
      function m(r) {
        function B() {
          La.m();
          N.reset();
          J.getExtension("WEBGL_lose_context").loseContext();
        }
        if (e()) return !1;
        var g = document.createElement("canvas");
        c(g, 5, 5);
        var J = null;
        try {
          J = g.getContext("webgl2", r);
        } catch (I) {
          return !1;
        }
        if (!J) return !1;
        y(J);
        N.fc(J);
        r = N.mb(J);
        if (!r.V && !r.X) return B(), !1;
        r = La.bc(J, r);
        B();
        return r ? !0 : !1;
      }
      function y(r) {
        r.clearColor(0, 0, 0, 0);
        r.disable(r.DEPTH_TEST);
        r.disable(r.BLEND);
        r.disable(r.DITHER);
        r.disable(r.STENCIL_TEST);
        r.disable(r.CULL_FACE);
        r.GENERATE_MIPMAP_HINT &&
          r.FASTEST &&
          r.hint(r.GENERATE_MIPMAP_HINT, r.FASTEST);
        r.disable(r.SAMPLE_ALPHA_TO_COVERAGE);
        r.disable(r.SAMPLE_COVERAGE);
        r.depthFunc(r.LEQUAL);
        r.clearDepth(1);
      }
      var l = null,
        t = null,
        q = null,
        n = null,
        p = !0,
        x = null,
        A = null,
        u = [],
        D = {
          D: function () {
            return l.width;
          },
          L: function () {
            return l.height;
          },
          ff: function () {
            return l;
          },
          df: function () {
            return a;
          },
          Y: function () {
            return p;
          },
          flush: function () {
            a.flush();
          },
          zf: function () {
            S.S();
            D.je();
          },
          je: function () {
            U.reset();
            W.reset();
            H.I();
            H.xd();
            a.disable(a.DEPTH_TEST);
            a.disable(a.BLEND);
            W.Ha();
            H.Aa();
          },
          Bd: function () {
            x || (x = new Uint8Array(l.width * l.height * 4));
            a.readPixels(0, 0, l.width, l.height, a.RGBA, a.UNSIGNED_BYTE, x);
            return x;
          },
          hf: function () {
            return l.toDataURL("image/jpeg");
          },
          jf: function () {
            S.H();
            t ||
              ((t = document.createElement("canvas")),
              (q = t.getContext("2d")));
            c(t, l.width, l.height);
            for (
              var r = D.Bd(),
                B = q.createImageData(t.width, t.height),
                g = t.width,
                J = t.height,
                I = B.data,
                f = 0;
              f < J;
              ++f
            )
              for (var K = J - f - 1, v = 0; v < g; ++v) {
                var E = 4 * (f * g + v),
                  C = 4 * (K * g + v);
                I[E] = r[C];
                I[E + 1] = r[C + 1];
                I[E + 2] = r[C + 2];
                I[E + 3] = r[C + 3];
              }
            q.putImageData(B, 0, 0);
            return t.toDataURL("image/png");
          },
          gf: function (r) {
            !t &&
              r &&
              ((t = document.createElement("canvas")),
              (q = t.getContext("2d")));
            var B = r ? t : document.createElement("canvas");
            c(B, l.width, l.height);
            (r ? q : B.getContext("2d")).drawImage(l, 0, 0);
            return B;
          },
          s: function (r) {
            r = Object.assign(
              {
                W: null,
                Gc: null,
                jb: null,
                kb: null,
                width: 512,
                height: 512,
                premultipliedAlpha: !1,
                xc: !0,
                antialias: !1,
                debug: !1,
                Ye: !1,
              },
              r
            );
            r.W
              ? ((a = r.W), (l = r.W.canvas))
              : r.kb && !r.jb
              ? (l = document.getElementById(r.kb))
              : r.jb && (l = r.jb);
            l || (l = document.createElement("canvas"));
            l.width = r.width;
            l.height = r.height;
            if (a) p = a instanceof WebGL2RenderingContext;
            else {
              p = !0;
              var B = {
                antialias: r.antialias,
                alpha: !0,
                preserveDrawingBuffer: !0,
                premultipliedAlpha: r.premultipliedAlpha,
                stencil: !1,
                depth: r.xc,
                failIfMajorPerformanceCaveat: !0,
                powerPreference: "high-performance",
              };
              navigator &&
                navigator.userAgent &&
                -1 !== navigator.userAgent.indexOf("noAntialiasing") &&
                (B.antialias = !1);
              var g = m(B);
              g || !B.antialias || e() || ((B.antialias = !1), (g = m(B)));
              g && (a = l.getContext("webgl2", B));
              a
                ? (p = !0)
                : ((a = l.getContext("webgl", B)) ||
                    (a = l.getContext("experimental-webgl", B)),
                  (p = !1));
            }
            if (!a) return b("WebGL1 and 2 are not enabled");
            r.Gc &&
              l.addEventListener &&
              (n = a.getExtension("WEBGL_lose_context")) &&
              ((A = r.Gc), l.addEventListener("webglcontextlost", A, !1));
            if (!N.s()) return b("Not enough GL capabilities");
            y(a);
            H.s();
            W.s();
            La.bc(a, N.Ad());
            u.forEach(function (J) {
              J(a);
            });
            u.splice(0);
            return !0;
          },
          Se: function () {
            return new Promise(function (r) {
              a ? r(a) : u.push(r);
            });
          },
          m: function () {
            a && (N.m(), H.m(), La.m());
            n &&
              A &&
              (l.removeEventListener("webglcontextlost", A, !1),
              (n = A = null));
            a = x = q = t = l = null;
            u.splice(0);
          },
        };
      return D;
    })(),
    Ha = (function () {
      function b() {
        null === e &&
          ("undefined" !== typeof H
            ? (e = H)
            : "undefined" !== typeof JEShaders && (e = JEShaders));
      }
      var e = null;
      return {
        reset: function () {
          e = null;
        },
        xe: function (c) {
          e !== c && (e && e.I(), (e = c));
        },
        Sa: function () {
          return e.Sa();
        },
        Aa: function () {
          return e.Aa();
        },
        $a: function (c) {
          return e.$a(c);
        },
        Nb: function () {
          return e.Nb();
        },
        I: function () {
          return e.I();
        },
        set: function (c) {
          b();
          return e.set(c);
        },
        za: function (c) {
          b();
          return e.za(c);
        },
        Mb: function (c) {
          b();
          return e.Mb(c);
        },
      };
    })(),
    U = (function () {
      function b(d) {
        a.bindTexture(a.TEXTURE_2D, d);
      }
      function e(d) {
        L[0] = d;
        d = w[0];
        var F = (d >> 16) & 32768,
          M = (d >> 12) & 2047,
          O = (d >> 23) & 255;
        return 103 > O
          ? F
          : 142 < O
          ? F | 31744 | ((255 == O ? 0 : 1) && d & 8388607)
          : 113 > O
          ? ((M |= 2048), F | ((M >> (114 - O)) + ((M >> (113 - O)) & 1)))
          : (F = (F | ((O - 112) << 10) | (M >> 1)) + (M & 1));
      }
      function c(d) {
        var F = new Uint16Array(d.length);
        d.forEach(function (M, O) {
          F[O] = e(M);
        });
        return F;
      }
      function m() {
        if (null !== h.tb) return h.tb;
        var d = l(c([0.5, 0.5, 0.5, 0.5]), !0);
        return null === d ? !0 : (h.tb = d);
      }
      function y() {
        if (null !== h.ub) return h.ub;
        var d = l(new Uint8Array([127, 127, 127, 127]), !1);
        return null === d ? !0 : (h.ub = d);
      }
      function l(d, F) {
        if (!Ha.Sa() || !B) return null;
        var M = null,
          O = Math.sqrt(d.length / 4);
        try {
          var V = a.getError();
          if ("FUCKING_BIG_ERROR" === V) return !1;
          M = k.instance({ isFloat: !1, F: F, array: d, width: O });
          V = a.getError();
          if (V !== a.NO_ERROR) return !1;
        } catch (da) {
          return !1;
        }
        S.H();
        a.viewport(0, 0, O, O);
        a.clearColor(0, 0, 0, 0);
        a.clear(a.COLOR_BUFFER_BIT);
        Ha.set("s0");
        M.Ga(0);
        W.l(!0, !0);
        d = 4 * O * O;
        F = new Uint8Array(d);
        a.readPixels(0, 0, O, O, a.RGBA, a.UNSIGNED_BYTE, F);
        O = !0;
        for (V = 0; V < d; ++V) O = O && 3 > Math.abs(F[V] - 127);
        M.remove();
        S.S();
        return O;
      }
      var t = 0,
        q = null,
        n = 0,
        p = null,
        x = null,
        A = null,
        u = null,
        D = null,
        r = null,
        B = !1,
        g = [],
        J = {
          isFloat: !1,
          isPot: !0,
          isLinear: !1,
          isMipmap: !1,
          isAnisotropicFiltering: !1,
          isMirrorX: !1,
          isMirrorY: !1,
          isSrgb: !1,
          isKeepArray: !1,
          isFlipY: null,
          width: 0,
          height: 0,
          url: null,
          array: null,
          data: null,
          B: null,
          sc: null,
          Rd: !1,
          F: !1,
          da: null,
          Va: 4,
          Bb: 0,
        },
        I = !1,
        f = null,
        K = null,
        v = [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        E = !1,
        C = !1,
        L = new Float32Array(1),
        w = new Int32Array(L.buffer),
        h = { tb: null, ub: null },
        k = {
          s: function () {
            B ||
              ((D = [a.RGBA, null, a.RGBA, a.RGBA]),
              (r = [a.RGBA, null, a.RGBA, a.RGBA]),
              (q = [
                a.TEXTURE0,
                a.TEXTURE1,
                a.TEXTURE2,
                a.TEXTURE3,
                a.TEXTURE4,
                a.TEXTURE5,
                a.TEXTURE6,
                a.TEXTURE7,
              ]),
              (E = "undefined" !== typeof JEContext),
              (C = "undefined" !== typeof N),
              E && JEContext.If() && q.push(a.TEXTURE8, a.TEXTURE9),
              (p = [-1, -1, -1, -1, -1, -1, -1, -1]),
              (u = [a.UNSIGNED_BYTE, a.FLOAT, a.FLOAT]),
              (B = !0));
          },
          Kd: function () {
            if (!x) {
              for (var d = new Float32Array(16384), F = 0; 16384 > F; ++F)
                d[F] = 2 * Math.random() - 1;
              x = {
                random: k.instance({
                  isFloat: !0,
                  isPot: !0,
                  array: d,
                  width: 64,
                }),
                Zc: k.instance({
                  isFloat: !1,
                  isPot: !0,
                  width: 1,
                  array: new Uint8Array([0, 0, 0, 0]),
                }),
              };
            }
            k.Me();
          },
          xf: function () {
            return x.Zc;
          },
          Me: function () {
            u[1] = N.qb(a);
          },
          ue: function () {
            r = D = [a.RGBA, a.RGBA, a.RGBA, a.RGBA];
          },
          Nc: function (d) {
            H.set("s1");
            S.H();
            var F = d.D(),
              M = d.L();
            a.viewport(0, 0, F, M);
            d.g(0);
            W.l(!1, !1);
          },
          Mf: function (d, F) {
            k.Nc(d);
            a.readPixels(0, 0, d.D(), d.L(), a.RGBA, a.UNSIGNED_BYTE, F);
          },
          Nf: function (d, F) {
            k.Nc(d);
            return N.Ya(0, 0, d.D(), d.L(), F);
          },
          nc: function (d, F, M, O, V, da, ea) {
            d.activeTexture(d.TEXTURE0);
            var na = d.createTexture();
            d.bindTexture(d.TEXTURE_2D, na);
            V = V instanceof Float32Array ? V : new Float32Array(V);
            d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, d.CLAMP_TO_EDGE);
            d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, d.CLAMP_TO_EDGE);
            d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MAG_FILTER, d.NEAREST);
            d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MIN_FILTER, d.NEAREST);
            d.pixelStorei(d.UNPACK_FLIP_Y_WEBGL, da);
            d.texImage2D(d.TEXTURE_2D, 0, d.RGBA, M, O, 0, d.RGBA, d.FLOAT, V);
            d.bindTexture(d.TEXTURE_2D, null);
            d.pixelStorei(d.UNPACK_FLIP_Y_WEBGL, !1);
            ea && (S.S(), H.za(d));
            d.viewport(0, 0, M, O);
            d.framebufferTexture2D(
              d.FRAMEBUFFER,
              d.COLOR_ATTACHMENT0,
              d.TEXTURE_2D,
              F,
              0
            );
            d.bindTexture(d.TEXTURE_2D, na);
            ea ? W.l(!0, !0) : W.La(d);
            d.deleteTexture(na);
            B && ((p[0] = -1), (A = null), (t = 0));
          },
          fb: function (d) {
            d !== t && (a.activeTexture(q[d]), (t = d));
          },
          instance: function (d) {
            var F;
            function M() {
              Q = void 0 !== z.B.videoWidth ? z.B.videoWidth : z.B.width;
              R = void 0 !== z.B.videoHeight ? z.B.videoHeight : z.B.height;
            }
            function O(G) {
              var P = a.getError();
              if ("FUCKING_BIG_ERROR" === P) return !1;
              a.texImage2D(a.TEXTURE_2D, 0, ba, Z, aa, G);
              P = a.getError();
              P !== a.NO_ERROR &&
                Z !== a.RGBA &&
                ((Z = a.RGBA), a.texImage2D(a.TEXTURE_2D, 0, ba, Z, aa, G));
              return !0;
            }
            function V() {
              if (!Na) {
                b(fa);
                la && a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, la);
                z.isPot
                  ? (a.texParameteri(
                      a.TEXTURE_2D,
                      a.TEXTURE_WRAP_S,
                      z.isMirrorX ? a.MIRRORED_REPEAT : a.REPEAT
                    ),
                    a.texParameteri(
                      a.TEXTURE_2D,
                      a.TEXTURE_WRAP_T,
                      z.isMirrorY ? a.MIRRORED_REPEAT : a.REPEAT
                    ))
                  : (a.texParameteri(
                      a.TEXTURE_2D,
                      a.TEXTURE_WRAP_S,
                      a.CLAMP_TO_EDGE
                    ),
                    a.texParameteri(
                      a.TEXTURE_2D,
                      a.TEXTURE_WRAP_T,
                      a.CLAMP_TO_EDGE
                    ));
                z.isAnisotropicFiltering &&
                  "undefined" !== typeof JESETTINGS &&
                  a.texParameterf(
                    a.TEXTURE_2D,
                    JEContext.kf().TEXTURE_MAX_ANISOTROPY_EXT,
                    JESETTINGS.Oe
                  );
                a.texParameteri(
                  a.TEXTURE_2D,
                  a.TEXTURE_MAG_FILTER,
                  z.isLinear ? a.LINEAR : a.NEAREST
                );
                z.isLinear
                  ? a.texParameteri(
                      a.TEXTURE_2D,
                      a.TEXTURE_MIN_FILTER,
                      z.isMipmap && !qa ? a.NEAREST_MIPMAP_LINEAR : a.LINEAR
                    )
                  : a.texParameteri(
                      a.TEXTURE_2D,
                      a.TEXTURE_MIN_FILTER,
                      z.isMipmap && !qa ? a.NEAREST_MIPMAP_NEAREST : a.NEAREST
                    );
                Z = D[z.Va - 1];
                ba = r[z.Va - 1];
                aa = u[Ia];
                if (N.Y()) {
                  var G = N.Cd();
                  Z === a.RGBA && aa === a.FLOAT
                    ? z.isMipmap || z.isLinear
                      ? (ba = La.Ed(a))
                      : N.cc()
                      ? G && (ba = G)
                      : (ba = a.RGBA16F || a.RGBA)
                    : Z === a.RGB &&
                      aa === a.FLOAT &&
                      G &&
                      ((ba = G), (Z = a.RGBA));
                }
                if ((z.F && !z.isFloat) || (z.isFloat && z.isMipmap && La.Vd()))
                  (ba = N.Dd()), (aa = N.qb(a));
                z.Bb && (Ba = z.Bb);
                z.isSrgb && 4 === z.Va && (Z = JEContext.vf());
                if (z.B) O(z.B);
                else if (z.url) O(pa);
                else if (ha) {
                  G = ha;
                  try {
                    "FUCKING_BIG_ERROR" !== a.getError() &&
                      (a.texImage2D(a.TEXTURE_2D, 0, ba, Q, R, 0, Z, aa, G),
                      a.getError() !== a.NO_ERROR &&
                        (a.texImage2D(
                          a.TEXTURE_2D,
                          0,
                          ba,
                          Q,
                          R,
                          0,
                          Z,
                          aa,
                          null
                        ),
                        a.getError() !== a.NO_ERROR &&
                          a.texImage2D(
                            a.TEXTURE_2D,
                            0,
                            a.RGBA,
                            Q,
                            R,
                            0,
                            a.RGBA,
                            a.UNSIGNED_BYTE,
                            null
                          )));
                  } catch (zb) {
                    a.texImage2D(a.TEXTURE_2D, 0, ba, Q, R, 0, Z, aa, null);
                  }
                  z.isKeepArray || (ha = null);
                } else
                  (G = a.getError()),
                    "FUCKING_BIG_ERROR" !== G &&
                      (a.texImage2D(a.TEXTURE_2D, 0, ba, Q, R, 0, Z, aa, null),
                      (G = a.getError()),
                      G !== a.NO_ERROR &&
                        ((Z = a.RGBA),
                        z.F &&
                          aa !== a.FLOAT &&
                          ((aa = a.FLOAT),
                          a.texImage2D(
                            a.TEXTURE_2D,
                            0,
                            ba,
                            Q,
                            R,
                            0,
                            Z,
                            aa,
                            null
                          ))));
                if (z.isMipmap)
                  if (!qa && Y) Y.pb(), (Ca = !0);
                  else if (qa) {
                    G = Math.log2(Math.min(Q, R));
                    ta = Array(1 + G);
                    ta[0] = fa;
                    for (var P = 1; P <= G; ++P) {
                      var ca = Math.pow(2, P),
                        T = Q / ca;
                      ca = R / ca;
                      var ra = a.createTexture();
                      b(ra);
                      a.texParameteri(
                        a.TEXTURE_2D,
                        a.TEXTURE_MIN_FILTER,
                        a.NEAREST
                      );
                      a.texParameteri(
                        a.TEXTURE_2D,
                        a.TEXTURE_MAG_FILTER,
                        a.NEAREST
                      );
                      a.texImage2D(a.TEXTURE_2D, 0, ba, T, ca, 0, Z, aa, null);
                      b(null);
                      ta[P] = ra;
                    }
                    Ca = !0;
                  }
                b(null);
                p[t] = -1;
                la && a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !1);
                va = !0;
                z.da && Y && (z.da(Y), (z.da = null));
              }
            }
            function da() {
              for (var G = Q * R, P = 2 * G, ca = 3 * G, T = 0; T < G; ++T)
                (ka[0][T] = wa[T]),
                  (ka[1][T] = wa[T + G]),
                  (ka[2][T] = wa[T + P]),
                  (ka[3][T] = wa[T + ca]);
            }
            function ea() {
              var G = Q * R * 4;
              oa = [
                new Uint8Array(G),
                new Uint8Array(G),
                new Uint8Array(G),
                new Uint8Array(G),
              ];
              ka = [
                new Float32Array(oa[0].buffer),
                new Float32Array(oa[1].buffer),
                new Float32Array(oa[2].buffer),
                new Float32Array(oa[3].buffer),
              ];
              Da = new Uint8Array(4 * G);
              wa = new Float32Array(Da.buffer);
              xa = !0;
            }
            function na() {
              F = new Uint8Array(Q * R * 4);
              Oa = new Float32Array(F.buffer);
              Ja = !0;
            }
            var z = Object.assign({}, J, d),
              ya = n++;
            null === z.isFlipY && (z.isFlipY = z.url ? !0 : !1);
            z.data &&
              ((z.array =
                "string" === typeof z.data
                  ? Ga(z.data)
                  : z.isFloat
                  ? new Float32Array(z.data)
                  : new Uint8Array(z.data)),
              (z.isFlipY = !1));
            var Ia = 0,
              Pa = z.B ? !0 : !1,
              za = null,
              Ka = null,
              Qa = !1;
            z.F = z.F || z.isFloat;
            z.F && (Ia = 1);
            !z.Rd && z.isFloat && C && !N.cc() && (z.isFloat = !1);
            z.isFloat && (Ia = 2);
            z.isAnisotropicFiltering &&
              E &&
              !JEContext.Cf() &&
              (z.isAnisotropicFiltering = !1);
            var fa = z.sc || a.createTexture(),
              pa = null,
              ha = !1,
              Q = 0,
              R = 0,
              va = !1,
              Na = !1,
              xa = !1,
              ka = null,
              oa = null,
              Da = null,
              wa = null,
              ba = null,
              Z = null,
              aa = null,
              la = z.isFlipY,
              gb = (d = z.F && z.isMipmap) && La.jd(),
              qa = d && !gb ? !0 : !1,
              ta = null,
              Ba = -1,
              Ra = -1,
              Ca = !1;
            var Ja = !1;
            var Oa = (F = null);
            z.width && ((Q = z.width), (R = z.height ? z.height : Q));
            var Y = {
              get: function () {
                return fa;
              },
              D: function () {
                return Q;
              },
              L: function () {
                return R;
              },
              yf: function () {
                return z.url;
              },
              Df: function () {
                return z.isFloat;
              },
              Ff: function () {
                return z.F;
              },
              Gf: function () {
                return z.isLinear;
              },
              pb: function () {
                a.generateMipmap(a.TEXTURE_2D);
              },
              fd: function (G, P) {
                qa
                  ? (G || (G = Y.rc()), k.fb(P), b(ta[G]), (p[P] = -1))
                  : Y.g(P);
              },
              rc: function () {
                -1 === Ba && (Ba = Math.log(Q) / Math.log(2));
                return Ba;
              },
              zd: function (G) {
                G || (G = Y.rc());
                if (qa) {
                  H.set("s12");
                  k.fb(0);
                  for (var P = Q, ca = R, T = 1; T <= G; ++T)
                    (P /= 2),
                      (ca /= 2),
                      H.K("u10", 0.25 / P, 0.25 / ca),
                      a.viewport(0, 0, P, ca),
                      b(ta[T - 1]),
                      a.framebufferTexture2D(
                        S.Na(),
                        a.COLOR_ATTACHMENT0,
                        a.TEXTURE_2D,
                        ta[T],
                        0
                      ),
                      W.l(!1, 1 === T);
                  p[0] = -1;
                } else
                  G !== Ra &&
                    ((Ra = G),
                    a.TEXTURE_MAX_LEVEL &&
                      a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAX_LEVEL, G)),
                    Y.pb();
              },
              Sf: function (G) {
                (Pa = !(
                  Array.isArray(G) ||
                  G.constructor === Float32Array ||
                  G.constructor === Uint8Array
                ))
                  ? ((ha = null), (z.B = G), M())
                  : (ha = G);
              },
              g: function (G) {
                if (!va) return !1;
                k.fb(G);
                if (p[G] === ya) return !1;
                b(fa);
                p[G] = ya;
                return !0;
              },
              Ga: function (G) {
                a.activeTexture(q[G]);
                t = G;
                b(fa);
                p[G] = ya;
              },
              o: function () {
                A = Y;
                a.framebufferTexture2D(
                  S.Na(),
                  a.COLOR_ATTACHMENT0,
                  a.TEXTURE_2D,
                  fa,
                  0
                );
              },
              G: function () {
                A = Y;
                a.viewport(0, 0, Q, R);
                a.framebufferTexture2D(
                  S.Na(),
                  a.COLOR_ATTACHMENT0,
                  a.TEXTURE_2D,
                  fa,
                  0
                );
              },
              Sb: k.Sb,
              se: function (G, P) {
                Q = G;
                R = P;
              },
              resize: function (G, P) {
                Y.se(G, P);
                V();
              },
              clone: function (G) {
                G = k.instance({
                  width: Q,
                  height: R,
                  F: z.F,
                  isFloat: z.isFloat,
                  isLinear: z.isLinear,
                  isMirrorY: z.isMirrorY,
                  isFlipY: G ? !la : la,
                  isPot: z.isPot,
                });
                Ha.set("s0");
                S.S();
                G.o();
                a.viewport(0, 0, Q, R);
                Y.g(0);
                W.l(!0, !0);
                return G;
              },
              Ce: function () {
                a.viewport(0, 0, Q, R);
              },
              remove: function () {
                a.deleteTexture(fa);
                Na = !0;
                g.splice(g.indexOf(Y), 1);
                Y = null;
              },
              refresh: function () {
                Y.Ga(0);
                la && a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !0);
                Pa
                  ? a.texImage2D(a.TEXTURE_2D, 0, ba, Z, aa, z.B)
                  : a.texImage2D(a.TEXTURE_2D, 0, ba, Q, R, 0, Z, aa, ha);
                la && a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !1);
              },
              Mc: function () {
                xa || ea();
                a.readPixels(0, 0, Q, 4 * R, a.RGBA, a.UNSIGNED_BYTE, Da);
                da();
                return ka;
              },
              fe: function () {
                xa || ea();
                return N.Ya(0, 0, Q, 4 * R, Da).then(function () {
                  da();
                  return ka;
                });
              },
              he: function () {
                Ja || na();
                a.readPixels(0, 0, Q, R, a.RGBA, a.UNSIGNED_BYTE, F);
                return Oa;
              },
              ge: function () {
                Ja || na();
                return N.Ya(0, 0, Q, R, F);
              },
              dc: function (G) {
                S.H();
                H.set("s13");
                Y.g(0);
                if (G)
                  a.viewport(0, 0, Q, R),
                    H.Ae("u11", 0.25, 0.25, 0.25, 0.25),
                    W.l(!1, !0);
                else
                  for (G = 0; 4 > G; ++G)
                    a.viewport(0, R * G, Q, R),
                      H.Uc("u11", v[G]),
                      W.l(!1, 0 === G);
              },
              Tb: function (G) {
                var P = aa === u[0] && !y();
                b(fa);
                la && a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !0);
                P
                  ? (Qa ||
                      ((za = document.createElement("canvas")),
                      (za.width = Q),
                      (za.height = R),
                      (Ka = za.getContext("2d")),
                      Ka.createImageData(Q, R),
                      (Qa = !0)),
                    null.data.set(G),
                    Ka.putImageData(null, 0, 0),
                    a.texImage2D(a.TEXTURE_2D, 0, ba, Z, aa, za))
                  : a.texImage2D(a.TEXTURE_2D, 0, ba, Q, R, 0, Z, aa, G);
                p[t] = ya;
                la && a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !1);
              },
              ag: function (G, P) {
                b(fa);
                P && a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !0);
                a.texImage2D(a.TEXTURE_2D, 0, ba, Z, aa, G);
                p[t] = ya;
                P && a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !1);
              },
              Pf: function (G, P) {
                var ca = Q * R,
                  T = 4 * ca;
                G = z.F ? (G ? "RGBE" : "JSON") : "RGBA";
                P && (G = P);
                P = N.Y() && !1;
                var ra = null;
                switch (G) {
                  case "RGBE":
                    ra = "s44";
                    break;
                  case "JSON":
                    ra = P ? "s0" : "s13";
                    break;
                  case "RGBA":
                  case "RGBAARRAY":
                    ra = "s7";
                }
                xa ||
                  ("RGBA" === G || "RGBE" === G || "RGBAARRAY" === G
                    ? ((oa = new Uint8Array(T)), (xa = !0))
                    : "JSON" !== G || P || ea());
                S.H();
                H.set(ra);
                Y.g(0);
                T = null;
                if ("RGBA" === G || "RGBE" === G || "RGBAARRAY" === G) {
                  a.viewport(0, 0, Q, R);
                  W.l(!0, !0);
                  a.readPixels(0, 0, Q, R, a.RGBA, a.UNSIGNED_BYTE, oa);
                  if ("RGBAARRAY" === G) return { data: oa };
                  I ||
                    ((f = document.createElement("canvas")),
                    (K = f.getContext("2d")),
                    (I = !0));
                  f.width = Q;
                  f.height = R;
                  ca = K.createImageData(Q, R);
                  ca.data.set(oa);
                  K.putImageData(ca, 0, 0);
                  T = f.toDataURL("image/png");
                } else if ("JSON" === G)
                  if (P)
                    (T = new Float32Array(ca)),
                      a.viewport(0, 0, Q, R),
                      W.l(!0, !0),
                      a.readPixels(0, 0, Q, R, a.RGBA, a.FLOAT, T);
                  else {
                    for (T = 0; 4 > T; ++T)
                      a.viewport(0, R * T, Q, R),
                        H.Uc("u11", v[T]),
                        W.l(!T, !T);
                    Y.Mc();
                    T = Array(ca);
                    for (P = 0; P < ca; ++P)
                      (T[4 * P] = ka[0][P]),
                        (T[4 * P + 1] = ka[1][P]),
                        (T[4 * P + 2] = ka[2][P]),
                        (T[4 * P + 3] = ka[3][P]);
                  }
                return {
                  format: G,
                  data: T,
                  width: Q,
                  height: R,
                  isMirrorY: z.isMirrorY,
                  isFlipY: "RGBA" === G ? z.isFlipY : !z.isFlipY,
                };
              },
            };
            z.isMipmap && !qa && va && !Ca && (Y.pb(), (Ca = !0));
            if (z.url)
              b(fa),
                a.texImage2D(
                  a.TEXTURE_2D,
                  0,
                  a.RGBA,
                  1,
                  1,
                  0,
                  a.RGBA,
                  a.UNSIGNED_BYTE,
                  null
                ),
                (pa = new Image()),
                (pa.Xe = "Anonymous"),
                (pa.crossOrigin = "Anonymous"),
                (pa.src = z.url),
                (pa.onload = function () {
                  Q = pa.width;
                  R = pa.height;
                  V();
                });
            else if (z.B) {
              var Sa = function () {
                M();
                Q ? V() : setTimeout(Sa, 1);
              };
              Sa();
            } else
              z.array
                ? (z.F && !z.isFloat
                    ? z.array instanceof Uint16Array
                      ? ((ha = z.array), V())
                      : m()
                      ? ((ha = c(z.array)), V())
                      : (V(), k.nc(a, fa, Y.D(), Y.L(), z.array, la, !0))
                    : ((ha = z.isFloat
                        ? z.array instanceof Float32Array
                          ? z.array
                          : new Float32Array(z.array)
                        : z.array instanceof Uint8Array
                        ? z.array
                        : new Uint8Array(z.array)),
                      V()),
                  z.isKeepArray ||
                    (ha && ha !== z.array && (ha = null), delete z.array))
                : z.sc
                ? (va = !0)
                : V();
            Y.uf = Y.D;
            z.da && va && (z.da(Y), (z.da = null));
            g.push(Y);
            return Y;
          },
          H: function (d) {
            d !== t && (a.activeTexture(q[d]), (t = d));
            p[d] = -1;
            b(null);
          },
          Re: function (d) {
            x.random.g(d);
          },
          Sb: function () {
            A = null;
            a.framebufferTexture2D(
              S.Na(),
              a.COLOR_ATTACHMENT0,
              a.TEXTURE_2D,
              null,
              0
            );
          },
          reset: function () {
            0 !== t && a.activeTexture(q[0]);
            for (var d = 0; d < q.length; ++d) p[d] = -1;
            t = -1;
          },
          Of: function () {
            t = -1;
          },
          Ke: function () {
            for (var d = 0; d < q.length; ++d) k.H(d);
          },
          oc: function () {
            x && (x.random.remove(), x.Zc.remove());
          },
          Zf: function (d, F) {
            if ("RGBA" === d.format || "RGBE" === d.format) {
              var M = new Image();
              M.src = d.data;
              M.onload = function () {
                k.instance({
                  isMirrorY: d.isMirrorY,
                  isFlipY: d.isFlipY,
                  isFloat: !1,
                  B: M,
                  da: function (O) {
                    if ("RGBA" === d.format) F(O);
                    else {
                      var V = d.width,
                        da = d.height,
                        ea = k.instance({
                          isMirrorY: d.isMirrorY,
                          isFloat: !0,
                          width: V,
                          height: da,
                          isFlipY: d.isFlipY,
                        });
                      S.S();
                      a.viewport(0, 0, V, da);
                      H.set("s45");
                      ea.o();
                      O.g(0);
                      W.l(!0, !0);
                      k.H(0);
                      F(ea);
                      N.flush();
                      setTimeout(O.remove, 50);
                    }
                  },
                });
              };
            } else
              "JSON" === d.format
                ? F(
                    k.instance({
                      isFloat: !0,
                      isFlipY: d.isFlipY,
                      width: d.width,
                      height: d.height,
                      array: new Float32Array(d.data),
                    })
                  )
                : F(!1);
          },
          md: c,
          m: function () {
            A && (S.S(), k.Sb(), S.H());
            k.Ke();
            g.slice(0).forEach(function (d) {
              d.remove();
            });
            g.splice(0);
            B = !1;
            n = 0;
            "undefined" !== typeof La && La.m();
            x = null;
          },
        };
      return k;
    })(),
    Ta = {
      instance: function (b) {
        var e = [U.instance(b), U.instance(b)],
          c = [e[1], e[0]],
          m = c,
          y = {
            re: function (l) {
              m[1].o();
              m[0].g(l);
              y.Wc();
            },
            Tc: function (l) {
              m[1].G();
              m[0].g(l);
              y.Wc();
            },
            Wc: function () {
              m = m === e ? c : e;
            },
            refresh: function () {
              m[0].refresh();
              m[1].refresh();
            },
            g: function (l) {
              m[0].g(l);
            },
            Ga: function (l) {
              m[0].Ga(l);
            },
            Qe: function (l) {
              m[1].g(l);
            },
            qf: function () {
              return m[0];
            },
            sf: function () {
              return m[1];
            },
            Tb: function (l) {
              m[0].Tb(l);
              m[1].Tb(l);
            },
            remove: function () {
              m[0].remove();
              m[1].remove();
              m = null;
            },
            sync: function () {
              y.Tc(0);
              H.set("s0");
              W.l(!1, !1);
            },
          };
        return y;
      },
    },
    W = (function () {
      function b(n) {
        var p = { R: null, indices: null };
        p.R = n.createBuffer();
        n.bindBuffer(n.ARRAY_BUFFER, p.R);
        n.bufferData(
          n.ARRAY_BUFFER,
          new Float32Array([-1, -1, 3, -1, -1, 3]),
          n.STATIC_DRAW
        );
        p.indices = n.createBuffer();
        n.bindBuffer(n.ELEMENT_ARRAY_BUFFER, p.indices);
        n.bufferData(
          n.ELEMENT_ARRAY_BUFFER,
          new Uint16Array([0, 1, 2]),
          n.STATIC_DRAW
        );
        return p;
      }
      var e = null,
        c = 0,
        m = !1,
        y = [],
        l = -2,
        t = -2,
        q = {
          reset: function () {
            t = l = -2;
          },
          s: function () {
            m || ((e = b(a)), q.Ha(), (m = !0));
          },
          instance: function (n) {
            var p = c++,
              x = n.indices ? n.indices.length : 0,
              A = "undefined" === typeof n.mode ? a.STATIC_DRAW : n.mode,
              u = a.createBuffer();
            a.bindBuffer(a.ARRAY_BUFFER, u);
            a.bufferData(
              a.ARRAY_BUFFER,
              n.R instanceof Float32Array ? n.R : new Float32Array(n.R),
              A
            );
            l = p;
            var D = null,
              r = null,
              B = null;
            if (n.indices) {
              D = a.createBuffer();
              a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, D);
              var g = null;
              65536 > n.indices.length
                ? ((g = Uint16Array), (r = a.UNSIGNED_SHORT), (B = 2))
                : ((g = Uint32Array), (r = a.UNSIGNED_INT), (B = 4));
              g = n.indices instanceof g ? n.indices : new g(n.indices);
              a.bufferData(a.ELEMENT_ARRAY_BUFFER, g, A);
              t = p;
            }
            var J = {
              gd: function (I) {
                l !== p && (a.bindBuffer(a.ARRAY_BUFFER, u), (l = p));
                I && Ha.Nb();
              },
              dd: function () {
                t !== p && (a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, D), (t = p));
              },
              bind: function (I) {
                J.gd(I);
                J.dd();
              },
              $e: function () {
                a.drawElements(a.TRIANGLES, x, r, 0);
              },
              af: function (I, f) {
                a.drawElements(a.TRIANGLES, I, r, f * B);
              },
              remove: function () {
                a.deleteBuffer(u);
                n.indices && a.deleteBuffer(D);
                J = null;
              },
            };
            y.push(J);
            return J;
          },
          Ha: function () {
            -1 !== l && (a.bindBuffer(a.ARRAY_BUFFER, e.R), (l = -1));
            -1 !== t &&
              (a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, e.indices), (t = -1));
          },
          l: function (n, p) {
            n && W.Ha();
            p && Ha.Aa();
            a.drawElements(a.TRIANGLES, 3, a.UNSIGNED_SHORT, 0);
          },
          La: function (n) {
            n = n || a;
            var p = b(n);
            n.bindBuffer(n.ARRAY_BUFFER, p.R);
            n.bindBuffer(n.ELEMENT_ARRAY_BUFFER, p.indices);
            Ha.$a(n);
            n.clear(n.COLOR_BUFFER_BIT);
            n.drawElements(n.TRIANGLES, 3, n.UNSIGNED_SHORT, 0);
            n.flush();
            n.bindBuffer(n.ARRAY_BUFFER, null);
            n.bindBuffer(n.ELEMENT_ARRAY_BUFFER, null);
            n.deleteBuffer(p.R);
            n.deleteBuffer(p.indices);
            q.reset();
            m && (q.Ha(), Ha.Aa());
          },
          oc: function () {
            var n = a,
              p = e;
            n.deleteBuffer(p.R);
            n.deleteBuffer(p.indices);
          },
          m: function () {
            q.oc();
            y.forEach(function (n) {
              n.remove();
            });
            a.bindBuffer(a.ARRAY_BUFFER, null);
            a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, null);
            q.reset();
            m = !1;
            y.splice(0);
            c = 0;
          },
        };
      return q;
    })(),
    S = (function () {
      var b = null,
        e = null,
        c = null,
        m = !1,
        y = [],
        l = { C: -2, mc: 1 },
        t = {
          Sa: function () {
            return m;
          },
          s: function () {
            if (!m) {
              b = a.createFramebuffer();
              var q = N.Y();
              e = q && a.DRAW_FRAMEBUFFER ? a.DRAW_FRAMEBUFFER : a.FRAMEBUFFER;
              c = q && a.READ_FRAMEBUFFER ? a.READ_FRAMEBUFFER : a.FRAMEBUFFER;
              m = !0;
            }
          },
          lf: function () {
            return e;
          },
          Fd: function () {
            return c;
          },
          Na: function () {
            return a.FRAMEBUFFER;
          },
          tf: function () {
            return l;
          },
          cf: function () {
            return b;
          },
          instance: function (q) {
            void 0 === q.wc && (q.wc = !1);
            var n = q.pa ? q.pa : null,
              p = q.width,
              x = void 0 !== q.height ? q.height : q.width,
              A = b,
              u = null,
              D = !1,
              r = !1,
              B = 0;
            n && ((p = p ? p : n.D()), (x = x ? x : n.L()));
            var g = {
              Sc: function () {
                D || ((A = a.createFramebuffer()), (D = !0), (B = l.mc++));
              },
              bd: function () {
                g.Sc();
                g.o();
                u = a.createRenderbuffer();
                a.bindRenderbuffer(a.RENDERBUFFER, u);
                a.renderbufferStorage(
                  a.RENDERBUFFER,
                  a.DEPTH_COMPONENT16,
                  p,
                  x
                );
                a.framebufferRenderbuffer(
                  e,
                  a.DEPTH_ATTACHMENT,
                  a.RENDERBUFFER,
                  u
                );
                a.clearDepth(1);
              },
              bind: function (J, I) {
                B !== l.C && (a.bindFramebuffer(e, A), (l.C = B));
                n && n.o();
                I && a.viewport(0, 0, p, x);
                J && a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT);
              },
              Pe: function () {
                B !== l.C && (a.bindFramebuffer(e, A), (l.C = B));
              },
              clear: function () {
                a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT);
              },
              Ve: function () {
                a.clear(a.COLOR_BUFFER_BIT);
              },
              We: function () {
                a.clear(a.DEPTH_BUFFER_BIT);
              },
              Ce: function () {
                a.viewport(0, 0, p, x);
              },
              o: function () {
                B !== l.C && (a.bindFramebuffer(e, A), (l.C = B));
              },
              rtt: function (J) {
                n = J;
                l.C !== B && (a.bindFramebuffer(a.FRAMEBUFFER, A), (l.C = B));
                J.o();
              },
              H: function () {
                a.bindFramebuffer(e, null);
                l.C = -1;
              },
              resize: function (J, I) {
                p = J;
                x = I;
                u &&
                  (a.bindRenderbuffer(a.RENDERBUFFER, u),
                  a.renderbufferStorage(
                    a.RENDERBUFFER,
                    a.DEPTH_COMPONENT16,
                    p,
                    x
                  ));
              },
              remove: function () {
                A === b ||
                  r ||
                  (a.bindFramebuffer(e, A),
                  a.framebufferTexture2D(
                    e,
                    a.COLOR_ATTACHMENT0,
                    a.TEXTURE_2D,
                    null,
                    0
                  ),
                  u &&
                    a.framebufferRenderbuffer(
                      e,
                      a.DEPTH_ATTACHMENT,
                      a.RENDERBUFFER,
                      null
                    ),
                  a.bindFramebuffer(e, null),
                  a.deleteFramebuffer(A),
                  u && a.deleteRenderbuffer(u));
                r = !0;
              },
            };
            q.wc && g.bd();
            y.push(g);
            return g;
          },
          H: function () {
            a.bindFramebuffer(e, null);
            l.C = -1;
          },
          Le: function () {
            a.bindFramebuffer(e, null);
            a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT);
            N.Vc();
            l.C = -1;
          },
          reset: function () {
            l.C = -2;
          },
          S: function () {
            0 !== l.C && (a.bindFramebuffer(e, b), (l.C = 0));
          },
          clear: function () {
            N.Vc();
            a.clear(a.COLOR_BUFFER_BIT);
          },
          m: function () {
            t.H();
            y.forEach(function (q) {
              q.remove();
            });
            null !== b && (a.deleteFramebuffer(b), (b = null));
            t.reset();
            m = !1;
            y.splice(0);
            l.mc = 1;
          },
        };
      return t;
    })(),
    N = (function () {
      function b() {
        q = "undefined" === typeof Ma ? JEContext : Ma;
        n = !0;
      }
      function e(f, K) {
        for (var v = 0; v < f.length; ++v) {
          var E = K.getExtension(f[v]);
          if (E) return E;
        }
        return null;
      }
      function c() {
        null !== g.cb && (clearTimeout(g.cb), (g.cb = null));
        g.ja = !1;
      }
      function m(f) {
        if (0 === g.ea.length) {
          g.M = a.PIXEL_PACK_BUFFER;
          g.ea.splice(0);
          g.Oa.splice(0);
          for (var K = 0; K < g.va; ++K)
            g.ea.push(a.createBuffer()), g.Oa.push(-1);
          g.U = 0;
          g.Eb = 0;
        }
        a.bindBuffer(g.M, g.ea[g.U]);
        f.byteLength !== g.Oa[g.U] &&
          (a.bufferData(g.M, f.byteLength, a.STREAM_READ),
          (g.Oa[g.U] = f.byteLength));
        g.Af = !0;
      }
      function y() {
        a.bindBuffer(g.M, null);
      }
      function l() {
        g.ia.forEach(function (f) {
          a.deleteSync(f);
        });
        g.ia.splice(0);
      }
      function t() {
        g.U = (g.U + 1) % g.va;
        ++g.Eb;
      }
      var q = null,
        n = !1,
        p = {
          yc: !1,
          Ob: null,
          Pb: null,
          Bc: !1,
          Ud: !1,
          Qb: null,
          Cc: !1,
          Rb: null,
          zc: !1,
          gb: null,
          Od: !1,
          hb: null,
          Pd: !1,
        },
        x = null,
        A = { V: !0, X: !0, ob: !0, Lc: !1 },
        u = null,
        D = !0,
        r = null,
        B = null,
        g = {
          nd: 1,
          va: -1,
          U: 0,
          Eb: 0,
          ja: !1,
          ea: [],
          ia: [],
          Oa: [],
          M: null,
          cb: null,
        },
        J = "undefined" === typeof window ? {} : window,
        I = {
          s: function () {
            if (n) return !0;
            I.reset();
            n || b();
            var f = a;
            if (!x.yc) {
              x.Ob = I.jc(f);
              J.GL_EXT_FLOAT = x.Ob;
              x.Bc = x.Ob ? !0 : !1;
              if (x.Bc || I.Y())
                (x.Pb = I.kc(f)),
                  (x.Ud = x.Pb ? !0 : !1),
                  (J.GL_EXT_FLOATLINEAR = x.Pb);
              x.yc = !0;
            }
            if (!x.zc) {
              x.Qb = I.Ja(f);
              x.Qb && ((x.Cc = !0), (J.GL_EXT_HALFFLOAT = x.Qb));
              if (x.Cc || I.Y())
                (x.Rb = I.lc(f)), (J.GL_EXT_HALFFLOATLINEAR = x.Rb);
              x.Bf = x.Rb ? !0 : !1;
              x.zc = !0;
            }
            x.gb = I.hc(f);
            x.Od = x.gb ? !0 : !1;
            J.GL_EXT_COLORBUFFERFLOAT = x.gb;
            x.hb = I.ic(f);
            x.Pd = x.hb ? !0 : !1;
            J.GL_EXT_COLORBUFFERHALFFLOAT = x.hb;
            S.s();
            U.s();
            if (!I.td()) return !1;
            W.s();
            U.Kd();
            return !0;
          },
          reset: function () {
            x = Object.assign({}, p);
            u = Object.assign({}, A);
          },
          D: function () {
            n || b();
            return q.D();
          },
          L: function () {
            n || b();
            return q.L();
          },
          Y: function () {
            n || b();
            return q.Y();
          },
          fc: function (f) {
            I.hc(f);
            I.ic(f);
            I.jc(f);
            I.kc(f);
            I.Ja(f);
            I.lc(f);
          },
          hc: e.bind(null, [
            "EXT_color_buffer_float",
            "WEBGL_color_buffer_float",
            "OES_color_buffer_float",
          ]),
          ic: e.bind(null, [
            "EXT_color_buffer_half_float",
            "WEBGL_color_buffer_half_float",
            "OES_color_buffer_half_float",
          ]),
          jc: e.bind(null, [
            "OES_texture_float",
            "MOZ_OES_texture_float",
            "WEBKIT_OES_texture_float",
          ]),
          kc: e.bind(null, [
            "OES_texture_float_linear",
            "MOZ_OES_texture_float_linear",
            "WEBKIT_OES_texture_float_linear",
          ]),
          Ja: e.bind(null, [
            "OES_texture_half_float",
            "MOZ_OES_texture_half_float",
            "WEBKIT_OES_texture_half_float",
          ]),
          lc: e.bind(null, [
            "OES_texture_half_float_linear",
            "MOZ_OES_texture_half_float_linear",
            "WEBKIT_OES_texture_half_float_linear",
          ]),
          qb: function (f) {
            var K = I.Ja(f);
            return K && K.HALF_FLOAT_OES
              ? K.HALF_FLOAT_OES
              : f.HALF_FLOAT || f.FLOAT;
          },
          Cd: function () {
            return B || a.RGBA32F || a.RGBA;
          },
          Dd: function () {
            return r || a.RGBA16F || a.RGBA;
          },
          Ad: function () {
            return u;
          },
          cc: function () {
            return u.V;
          },
          Ue: function () {
            return u.X;
          },
          Te: function () {
            return u.ob;
          },
          kd: function () {
            return u.Lc && D;
          },
          Yc: function (f) {
            D = f;
            !f && g.ja && (l(), a.bindBuffer(g.M, null), (g.ja = !1));
          },
          Hf: function () {
            return g.ja;
          },
          ab: function (f, K, v) {
            function E() {
              f.bindTexture(f.TEXTURE_2D, null);
              f.bindFramebuffer(C, null);
              f.deleteTexture(h);
              f.deleteFramebuffer(w);
            }
            var C = f.FRAMEBUFFER,
              L = f.NEAREST,
              w = f.createFramebuffer();
            f.bindFramebuffer(C, w);
            var h = f.createTexture();
            f.activeTexture(f.TEXTURE0);
            f.bindTexture(f.TEXTURE_2D, h);
            f.pixelStorei(f.UNPACK_FLIP_Y_WEBGL, !1);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_S, f.CLAMP_TO_EDGE);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_T, f.CLAMP_TO_EDGE);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MAG_FILTER, L);
            f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MIN_FILTER, L);
            f.texImage2D(f.TEXTURE_2D, 0, K, 3, 3, 0, f.RGBA, v, null);
            f.framebufferTexture2D(
              f.FRAMEBUFFER,
              f.COLOR_ATTACHMENT0,
              f.TEXTURE_2D,
              h,
              0
            );
            if (
              f.checkFramebufferStatus(f.READ_FRAMEBUFFER || f.FRAMEBUFFER) !==
              f.FRAMEBUFFER_COMPLETE
            )
              return E(), !1;
            Ha.Mb(f);
            f.clearColor(0, 0, 0, 0);
            f.viewport(0, 0, 3, 3);
            f.disable(f.DEPTH_TEST);
            f.clear(f.COLOR_BUFFER_BIT);
            W.La(f);
            f.bindFramebuffer(C, null);
            Ha.za(f);
            f.activeTexture(f.TEXTURE0);
            f.bindTexture(f.TEXTURE_2D, h);
            W.La(f);
            K = new Uint8Array(36);
            f.readPixels(0, 0, 3, 3, f.RGBA, f.UNSIGNED_BYTE, K);
            E();
            for (v = 0; 36 > v; ++v)
              if (3 !== v % 4 && 3 < Math.abs(K[v] - 127)) return !1;
            return !0;
          },
          mb: function (f) {
            var K = { V: !1, X: !1 };
            f.disable(f.BLEND);
            f.clearColor(0, 0, 0, 0);
            f.clear(f.COLOR_BUFFER_BIT);
            f.RGBA32F &&
              I.ab(f, f.RGBA32F, f.FLOAT) &&
              ((K.V = !0), (B = f.RGBA32F));
            !K.V && I.ab(f, f.RGBA, f.FLOAT) && ((K.V = !0), (B = f.RGBA));
            var v = I.qb(f);
            r = null;
            f.RGBA16F && I.ab(f, f.RGBA16F, v) && ((K.X = !0), (r = f.RGBA16F));
            !K.X && I.ab(f, f.RGBA, v) && ((K.X = !0), (r = f.RGBA));
            return K;
          },
          ud: function () {
            var f = S.instance({ width: 2 });
            f.Sc();
            var K = U.instance({ width: 2, isFloat: !0, Va: 3 });
            f.o();
            K.o();
            I.flush();
            a.checkFramebufferStatus(S.Fd()) !== a.FRAMEBUFFER_COMPLETE
              ? (U.ue(), (u.ob = !1))
              : (u.ob = !0);
            f.remove();
            K.remove();
          },
          vd: function () {
            var f = !1;
            I.Y() &&
              (f =
                "PIXEL_PACK_BUFFER STREAM_READ SYNC_GPU_COMMANDS_COMPLETE WAIT_FAILED fenceSync deleteSync createBuffer"
                  .split(" ")
                  .every(function (K) {
                    return "undefined" !== typeof a[K];
                  }));
            u.Lc = f;
          },
          td: function () {
            var f = I.mb(a);
            Object.assign(u, f);
            if (!u.V && !u.X) return !1;
            I.ud();
            I.vd();
            return !0;
          },
          ie: function (f, K, v, E, C) {
            a.readPixels(f, K, v, E, a.RGBA, a.UNSIGNED_BYTE, C);
            return Promise.resolve(C, !1);
          },
          Ya: function (f, K, v, E, C, L, w) {
            if (!I.kd()) return I.ie(f, K, v, E, C);
            g.va = w || g.nd;
            m(C);
            a.readPixels(f, K, v, E, a.RGBA, a.UNSIGNED_BYTE, 0);
            g.ia[g.U] = a.fenceSync(a.SYNC_GPU_COMMANDS_COMPLETE, 0);
            I.flush();
            var h = !1;
            return new Promise(function (k, d) {
              function F() {
                if (!g.ja) return c(), y(), t(), d(), !1;
                var M = (g.U + 1) % g.va;
                switch (a.clientWaitSync(g.ia[M], 0, 0)) {
                  case a.TIMEOUT_EXPIRED:
                  case a.WAIT_FAILED:
                    break;
                  default:
                    return (
                      c(),
                      a.deleteSync(g.ia[M]),
                      (g.ia[M] = null),
                      a.bindBuffer(g.M, g.ea[M]),
                      a.getBufferSubData(g.M, 0, C),
                      y(),
                      t(),
                      k(C, h),
                      !0
                    );
                }
                g.cb = setTimeout(F, 0);
                return !1;
              }
              c();
              g.Eb + 1 < g.va
                ? (y(), t(), k(C, !1))
                : ((g.ja = !0), F() || !L || h || ((h = !0), L()));
            });
          },
          Vc: function () {
            a.viewport(0, 0, I.D(), I.L());
          },
          flush: function () {
            a.flush();
          },
          m: function () {
            c();
            l();
            U.m();
            S.m();
            W.m();
            g.ea.forEach(function (f) {
              a.deleteBuffer(f);
            });
            g.ea.splice(0);
            Ha.reset();
            n = !1;
          },
        };
      return I;
    })(),
    La = (function () {
      function b(v, E, C, L) {
        g.texParameteri(
          g.TEXTURE_2D,
          g.TEXTURE_MIN_FILTER,
          L ? g.NEAREST_MIPMAP_NEAREST : g.LINEAR
        );
        var w = null;
        if (null !== C)
          try {
            w = g.getError();
            if ("FUCKING_BIG_ERROR" === w) return !1;
            g.texImage2D(g.TEXTURE_2D, 0, v, 4, 4, 0, g.RGBA, E, C);
            w = g.getError();
            if (w !== g.NO_ERROR) return !1;
          } catch (h) {
            return !1;
          }
        L && g.generateMipmap(g.TEXTURE_2D);
        g.clear(g.COLOR_BUFFER_BIT);
        W.La(g);
        w = g.getError();
        if ("FUCKING_BIG_ERROR" === w) return !1;
        g.readPixels(0, 0, 2, 2, g.RGBA, g.UNSIGNED_BYTE, x);
        w = g.getError();
        w === g.INVALID_OPERATION &&
          "undefined" !== typeof g.PIXEL_PACK_BUFFER &&
          (g.bindBuffer(g.PIXEL_PACK_BUFFER, null),
          g.readPixels(0, 0, 2, 2, g.RGBA, g.UNSIGNED_BYTE, x),
          (w = g.getError()));
        if (w !== g.NO_ERROR) return !1;
        C = !0;
        for (L = 0; 16 > L; ++L) C = C && 4 > Math.abs(x[L] - 127);
        C && ((n.Jc = E), (n.vc = v));
        return C;
      }
      function e(v, E) {
        return J.V && b(v, g.FLOAT, new Float32Array(A), E)
          ? ((q = t.Zb), !0)
          : !1;
      }
      function c(v, E, C) {
        if (!J.X) return !1;
        var L = U.md(A),
          w = N.Ja(g);
        if (
          (w && w.HALF_FLOAT_OES && b(v, w.HALF_FLOAT_OES, L, E)) ||
          (g.HALF_FLOAT && b(v, g.HALF_FLOAT, L, E))
        )
          return (q = t.ra), !0;
        L = new Float32Array(A);
        if (b(v, g.FLOAT, L, E)) return (q = t.ra), !0;
        g.bindTexture(g.TEXTURE_2D, C);
        g.texImage2D(
          g.TEXTURE_2D,
          0,
          g.RGBA,
          2,
          2,
          0,
          g.RGBA,
          g.UNSIGNED_BYTE,
          null
        );
        g.bindFramebuffer(n.Ia, K);
        U.nc(g, C, 2, 2, L, !1, !1);
        g.bindFramebuffer(n.Ia, null);
        g.bindTexture(g.TEXTURE_2D, C);
        return b(v, null, null, E) ? ((q = t.ra), !0) : !1;
      }
      function m(v, E, C) {
        p = !0;
        if (c(v, !0, C) || e(E, !0)) return !0;
        p = !1;
        return c(v, !1, C) || e(E, !1) ? !0 : !1;
      }
      function y(v) {
        if (q === t.I) {
          g = v || a;
          q = t.RGBA8;
          p = !0;
          N.fc(g);
          J || (J = N.mb(g));
          S.reset();
          K = g.createFramebuffer();
          n.Ia = g.DRAW_FRAMEBUFFER || g.FRAMEBUFFER;
          g.bindFramebuffer(n.Ia, null);
          g.clearColor(0, 0, 0, 0);
          g.viewport(0, 0, 2, 2);
          H.I();
          I = H.za(g);
          v = g.createTexture();
          g.activeTexture(g.TEXTURE0);
          g.bindTexture(g.TEXTURE_2D, v);
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT);
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT);
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
          f = v;
          var E = (v = g.RGBA),
            C = g.RGBA16F,
            L = g.RGBA32F;
          L && (v = L);
          C && (E = C);
          if ((C || L) && m(E, v, f)) return l(), !0;
          v = E = g.RGBA;
          if (m(E, v, f)) return l(), !0;
          q = t.RGBA8;
          l();
          return !1;
        }
      }
      function l() {
        g.deleteProgram(I.ga);
        g.deleteTexture(f);
        f = I = null;
      }
      for (
        var t = { I: -1, Zb: 3, ra: 2, RGBA8: 0 },
          q = t.I,
          n = { Jc: null, vc: null, Ia: null },
          p = !0,
          x = new Uint8Array(16),
          A = Array(64),
          u = 0;
        4 > u;
        ++u
      )
        for (var D = 0; 4 > D; ++D) {
          var r = 0 === (D + u) % 2 ? 1 : 0,
            B = 4 * u + D;
          A[4 * B] = r;
          A[4 * B + 1] = r;
          A[4 * B + 2] = r;
          A[4 * B + 3] = r;
        }
      var g = null,
        J = null,
        I = null,
        f = null,
        K = null;
      return {
        jd: function (v) {
          y(v);
          return p;
        },
        bc: function (v, E) {
          q === t.I && (typeof ("undefined" !== E) && (J = E), y(v));
          return q !== t.RGBA8;
        },
        Ef: function (v) {
          y(v);
          return q === t.Zb;
        },
        Vd: function (v) {
          y(v);
          return q === t.ra;
        },
        mf: function (v) {
          y(v);
          return n.Jc;
        },
        Ed: function (v) {
          y(v);
          return n.vc;
        },
        m: function () {
          g = null;
          p = !0;
          q = t.I;
          J = null;
        },
      };
    })(),
    Ya = {
      instance: function (b) {
        var e = null,
          c = !1,
          m = !1,
          y = null,
          l = !1,
          t = !1,
          q = null,
          n = "undefined" === typeof b.preprocessing ? !1 : b.preprocessing,
          p =
            "undefined" === typeof b.preprocessingSize
              ? b.size
              : b.preprocessingSize;
        b.mask &&
          ((c = !0),
          X && void 0 !== X.cd && (b.mask = X.cd + b.mask),
          (e = U.instance({ isFloat: !1, url: b.mask })));
        var x = !1;
        b.customInputShader &&
          ((x = "s46"),
          H.$b({
            name: "_",
            id: x,
            h: b.customInputShader,
            Yf: ["uSource"],
            precision: "lowp",
          }),
          H.Z(x, [{ type: "1i", name: "_", value: 0 }]));
        switch (n) {
          case "sobel":
            q = "s33";
            l = !0;
            break;
          case "meanNormalization":
            q = "s34";
            l = !0;
            break;
          case "grayScale":
            q = "s30";
            l = !1;
            break;
          case "grayScaleTilt":
            q = "s31";
            t = !0;
            l = !1;
            break;
          case "rgbGrayTilt":
            q = "s32";
            t = !0;
            l = !1;
            break;
          case "copy":
            q = x ? x : "s0";
            break;
          case "inputLightRegulation":
            q = x ? x : "s30";
            y = Ua.instance({ uc: p, Ic: b.size, Ec: b.nBlurPass, N: !1 });
            m = !0;
            break;
          case "inputMix0":
            q = "none";
            y = Va.instance({
              A: p,
              aa: b.varianceMin,
              T: b.blurKernelSizePx,
              gain: b.gain || 1,
              N: !1,
            });
            m = !0;
            break;
          case "inputMix1":
            q = "none";
            y = Wa.instance({
              A: p,
              aa: b.varianceMin,
              T: b.blurKernelSizePx,
              gain: b.gain || 1,
              N: !1,
            });
            m = !0;
            break;
          case "inputCut4":
            q = "none";
            y = Xa.instance({
              A: p,
              aa: b.varianceMin,
              T: b.blurKernelSizePx,
              gain: b.gain || 1,
              xa: b.isNormalized || !1,
              Kb: b.overlap || 0,
              N: !1,
            });
            p *= y.Gd();
            m = !0;
            break;
          case "direct":
          case "none":
            q = "abort";
            break;
          default:
            q = "s4";
        }
        p = Math.ceil(p);
        t && H.Z(q, [{ name: "u27", type: "1f", value: b.tilt }]);
        c && (q += "Mask");
        var A = U.instance({ isFloat: !1, isPot: !1, width: b.size }),
          u = {
            D: function () {
              return b.size;
            },
            pf: function () {
              return p;
            },
            rb: function () {
              return u.D();
            },
            Id: function () {
              return m ? y.wa() : A;
            },
            J: function (D) {
              S.S();
              "abort" !== q &&
                ("none" !== q &&
                  (H.set(q),
                  l && H.P("u28", 1 / b.size),
                  A.G(),
                  c && e.g(1),
                  W.l(!1, !1),
                  A.g(0),
                  (D = A)),
                m && y.process(D));
            },
            m: function () {
              A.remove();
              c && e.remove();
            },
          };
        return u;
      },
    },
    db = {
      instance: function (b) {
        function e(E) {
          y.forEach(function (C, L) {
            l[L][0] = E[0][C];
            l[L][1] = E[1][C];
            l[L][2] = E[2][C];
            l[L][3] = E[3][C];
          });
          return l;
        }
        b.normalize = b.normalize || !1;
        var c = {
            input: null,
            bias: null,
            vb: null,
            ma: null,
            Ib: null,
            Gb: null,
            Hb: null,
          },
          m = null,
          y = [],
          l = [],
          t = !1,
          q = null,
          n = !0,
          p = -1,
          x = b.isReorganize ? b.isReorganize : !1,
          A = b.kernelsCount ? !0 : !1,
          u = ["s27", "s28", "s29"][b.shiftRGBAMode || 0],
          D = { isEnabled: !1 };
        b.Td
          ? ((b.sparsity =
              "undefined" !== typeof b.sparsity ? b.sparsity : b.Xa.rb()),
            (n = !1))
          : "full" === b.connectivityUp && (b.sparsity = b.Xa.rb());
        var r = {
            elu: "s16",
            elu01: "s17",
            relu: "s15",
            arctan: "s18",
            arctan2: "s19",
            sigmoid: "s14",
            copy: "s0",
          }[b.activation],
          B = b.sparsity * b.sparsity,
          g = !1,
          J = b.size,
          I = "";
        if (b.maxPooling) {
          switch (b.maxPooling.size) {
            case 2:
              I = "s35";
              break;
            case 4:
              I = "s36";
          }
          g = !0;
          J /= b.maxPooling.size;
          c.Gb = U.instance({ isFloat: !0, isPot: !1, width: J });
        }
        var f = -1,
          K = null;
        n && (c.ma = U.instance({ isFloat: !0, isPot: !1, width: b.size }));
        c.bias = U.instance(b.bias);
        var v = {
          D: function () {
            return b.size;
          },
          rb: function () {
            return J;
          },
          pc: function () {
            return b.classesCount;
          },
          ed: function (E) {
            m.g(E);
          },
          be: function () {
            b.remap &&
              b.remap.isEnabled &&
              (D = {
                isEnabled: !0,
                Yd: U.instance(b.remap.maskTexture),
                Ua: b.remap.layers.map(function (E) {
                  return b.parent.Hd(E);
                }),
                depth: b.remap.depth,
              });
          },
          ve: function () {
            switch (b.connectivityUp) {
              case "direct":
                K = Za.instance(b.connectivity);
                break;
              case "square":
                K = $a.instance(b.connectivity);
                break;
              case "squareFast":
                K = ab.instance(b.connectivity, b.activation);
                break;
              case "full":
                K = bb.instance(b.connectivity);
                break;
              case "conv":
                (p = b.kernelsCount),
                  (K = cb.instance(b.connectivity)),
                  x &&
                    (c.Ib = U.instance({
                      width: J,
                      isFloat: !0,
                      isFlipY: !1,
                      isPot: !1,
                    }));
            }
            if (K.oa) {
              var E = b.size * b.sparsity;
              f = Math.log(E / b.size) / Math.log(2);
              c.input = U.instance({
                isMipmap: !0,
                isFloat: !0,
                isPot: !0,
                width: E,
                Bb: f,
              });
              c.vb = U.instance({ isFloat: !0, isPot: !0, width: b.size });
            }
          },
          J: function (E, C) {
            m = E;
            K.oa
              ? (c.input.G(),
                A && c.bias.g(2),
                K.J(D),
                c.input.g(0),
                c.input.zd(f),
                c.vb.G(),
                A ? H.set("s0") : (H.set(u), H.P("u4", B), c.bias.g(1)),
                c.input.fd(f, 0),
                W.l(!1, !1),
                H.set(r),
                c.ma.o(),
                c.vb.g(0),
                W.l(!1, !1))
              : (c.ma.G(), c.bias.g(1), K.J());
            if (n)
              return (
                (C = c.ma),
                g &&
                  (c.Gb.G(),
                  C.g(0),
                  H.set(I),
                  H.K("u10", 1 / b.size, 1 / b.size),
                  W.l(!1, !1),
                  (C = c.Gb)),
                x &&
                  (c.Ib.o(),
                  H.set("s21"),
                  H.K("u14", p, J / p),
                  C.g(0),
                  W.l(!1, !1),
                  (C = c.Ib)),
                C.g(0),
                C
              );
            var L = c.ma;
            b.normalize &&
              ((E = L),
              H.set("gpuRawAvg" === t ? "s9" : "s8"),
              H.P("u6", 1 / b.size),
              c.Hb.G(),
              E.g(0),
              W.l(!1, !1),
              (L = c.Hb));
            E = null;
            switch (t) {
              case "cpuRGBA2Float":
                L.dc(!1);
                C ? (E = v.de(L).then(q)) : ((L = v.ee(L)), q(L));
                break;
              case "cpuMeanFloat":
                L.dc(!0);
                if (C) E = L.ge().then(q);
                else {
                  L = L.he();
                  for (var w = 0; w < L.length; ++w);
                  q(L);
                }
                break;
              case "gpuRawAvg":
              case "gpuRaw":
                L.g(0);
              case "none":
                null !== q && q(L);
            }
            C && null === E && (E = Promise.resolve());
            return E;
          },
          od: function (E) {
            var C = !1;
            E &&
              ((t = E.Jb || "none"), (q = E.Fb || null), (C = E.Hc ? !0 : !1));
            c.ma = U.instance({
              isFloat: !0,
              isPot: !0,
              isLinear: C,
              isMipmap: !1,
              width: b.size,
            });
            E =
              "undefined" !== typeof b.classesCount && b.classesCount
                ? b.classesCount
                : b.size * b.size;
            for (var L = (C = 0), w = 0; C < E; ++C)
              y.push(L + (b.size - 1 - w) * b.size),
                l.push([-1, -1, -1, -1]),
                ++L,
                L === b.size && ((L = 0), ++w);
            b.normalize &&
              (c.Hb = U.instance({ isFloat: !0, isPot: !0, width: b.size }));
          },
          de: function (E) {
            return E.fe().then(e);
          },
          ee: function (E) {
            E = E.Mc();
            e(E);
            return l;
          },
          m: function () {
            for (var E in c) {
              var C = c[E];
              C && C.remove();
            }
            K && (K.m(), (K = null));
          },
        };
        b.Xa && v.ve(b.Xa);
        return v;
      },
    };
  function eb(b) {
    var e = null,
      c = null,
      m = 0,
      y = this;
    this.s = function (l) {
      this.te(l.Ua);
      c.od({ Jb: l.Jb, Hc: l.Hc || !1, Fb: l.Fb });
    };
    this.Hd = function (l) {
      return e[l];
    };
    this.te = function (l) {
      var t = null;
      m = l.length;
      e = l.map(function (q, n) {
        q = Object.assign({}, q, {
          index: n,
          parent: y,
          Xa: t,
          Td: n === m - 1,
        });
        return (t = n = 0 === n ? Ya.instance(q) : db.instance(q));
      });
      c = e[m - 1];
      e.forEach(function (q, n) {
        0 !== n && q.be();
      });
    };
    this.J = function (l) {
      l.g(0);
      var t = l;
      e.forEach(function (q) {
        t = q.J(t, !1);
      });
      return t;
    };
    this.wa = function () {
      return c.Id();
    };
    this.pc = function () {
      return c.pc();
    };
    this.m = function () {
      e &&
        (e.forEach(function (l) {
          l.m();
        }),
        (c = e = null),
        (m = 0));
    };
    "undefined" !== typeof b && this.s(b);
  }
  var Za = {
      instance: function (b) {
        var e = U.instance(b.weights);
        return {
          oa: !0,
          Ma: function () {
            return 1;
          },
          m: function () {
            e.remove();
          },
          Jd: function () {
            return e;
          },
          J: function () {
            H.set("s26");
            e.g(1);
            W.l(!1, !1);
          },
        };
      },
    },
    bb = {
      instance: function (b) {
        var e = b.fromLayerSize,
          c = U.instance(b.weights);
        return {
          oa: !0,
          Ma: function () {
            return e;
          },
          m: function () {
            c.remove();
          },
          J: function (m) {
            if (m.isEnabled) {
              H.set("s24");
              m.Yd.g(3);
              for (var y = Math.min(m.Ua.length, m.depth), l = 0; l < y; ++l)
                m.Ua[l].ed(4 + l);
            } else H.set("s23");
            H.P("u18", b.toLayerSize);
            H.P("u19", b.fromLayerSize);
            c.g(1);
            W.l(!1, !1);
          },
        };
      },
    },
    $a = {
      instance: function (b) {
        for (
          var e = b.fromLayerSize,
            c = b.toLayerSize,
            m = b.toSparsity,
            y = m * c,
            l = y / e,
            t = e / c,
            q = 0,
            n = 0,
            p = 0,
            x = Array(m * c * m * c * 4),
            A = Array(m * c * m * c * 4),
            u = Array(e * e),
            D = 0;
          D < u.length;
          ++D
        )
          u[D] = 0;
        D = Math.floor(m / 2);
        for (var r = 0.5 / c, B = 0.5 / e, g = 0.5 / y, J = 0; J < c; ++J)
          for (var I = Math.round(J * t), f = 0; f < c; ++f) {
            var K = Math.round(f * t),
              v = J / c,
              E = f / c;
            v += r;
            E += r;
            for (var C = 0; C < m; ++C) {
              var L = I + C - D;
              0 > L && (L += e);
              L >= e && (L -= e);
              for (var w = 0; w < m; ++w) {
                var h = q / y,
                  k = n / y,
                  d = K + w - D;
                0 > d && (d += e);
                d >= e && (d -= e);
                var F = L / e,
                  M = d / e;
                k = 1 - k - 1 / y;
                F += B;
                M += B;
                h += g;
                k += g;
                var O = J * m + C,
                  V = f * m + w;
                V = c * m - V - 1;
                O = V * c * m + O;
                x[4 * O] = h;
                x[4 * O + 1] = k;
                x[4 * O + 2] = F;
                x[4 * O + 3] = M;
                M = u[d * e + L]++;
                O = M % l;
                F = L * l + O;
                d = d * l + (M - O) / l;
                d = e * l - 1 - d;
                d = d * e * l + F;
                A[4 * d] = h;
                A[4 * d + 1] = k;
                A[4 * d + 2] = v;
                A[4 * d + 3] = E;
                ++q >= y && ((q = 0), ++n);
                ++p;
              }
            }
          }
        u = null;
        var da = U.instance(b.weights);
        delete b.weights.data;
        var ea = U.instance({
          width: y,
          isFloat: !0,
          array: new Float32Array(A),
          isPot: !0,
        });
        A = null;
        var na = U.instance({
          width: y,
          isFloat: !0,
          array: new Float32Array(x),
          isPot: !0,
        });
        x = null;
        return {
          oa: !0,
          Ma: function () {
            return l;
          },
          m: function () {
            ea.remove();
            na.remove();
            da.remove();
          },
          J: function () {
            H.set("s22");
            da.g(1);
            na.g(2);
            W.l(!1, !1);
          },
        };
      },
    },
    cb = {
      instance: function (b) {
        var e = b.kernelsCount,
          c = b.toSparsity,
          m = (c * b.toLayerSize) / b.fromLayerSize,
          y = b.inputScale || [1, 1],
          l = U.instance(b.weights);
        return {
          oa: !0,
          Ma: function () {
            return m;
          },
          wf: function () {
            return c;
          },
          Jd: function () {
            return l;
          },
          m: function () {
            l.remove();
          },
          J: function () {
            H.set("s25");
            H.ye("u26", y);
            H.P("u24", e);
            H.P("u25", c);
            H.P("u18", b.toLayerSize);
            H.P("u19", b.fromLayerSize);
            l.g(1);
            W.l(!1, !1);
          },
        };
      },
    },
    ab = {
      instance: function (b, e) {
        var c = b.fromLayerSize,
          m = b.toLayerSize,
          y = b.toSparsity,
          l = b.stride ? b.stride : 1,
          t = (y * m) / c,
          q = m < c,
          n = c / m,
          p = U.instance(b.weights),
          x =
            "s47" +
            [c.toString(), m.toString(), y.toString(), l.toString(), e].join(
              "_"
            );
        H.yd(x) ||
          ((b = sa(e)),
          (m = [
            { type: "1f", name: "u18", value: m },
            { type: "1f", name: "u30", value: l },
          ]),
          q && m.push({ type: "1f", name: "u19", value: c }),
          (c = [(q ? t : y).toFixed(1), b]),
          q && c.push(n.toFixed(1)),
          H.Ld(q ? "s41" : "s40", x, c),
          H.Z(
            x,
            m.concat([
              { type: "1i", name: "u16", value: 0 },
              { type: "1i", name: "u3", value: 1 },
              { type: "1i", name: "u15", value: 3 },
            ])
          ));
        return {
          oa: !1,
          Ma: function () {
            return t;
          },
          m: function () {
            p.remove();
          },
          J: function () {
            H.set(x);
            p.g(3);
            W.l(!1, !1);
          },
        };
      },
    },
    Ua = {
      instance: function (b) {
        var e = b.Ec ? b.Ec : 3,
          c = b.uc ? b.uc : 64,
          m = b.Ic ? b.Ic : 64,
          y = b.N ? !0 : !1;
        b = { isFloat: !1, width: c, isPot: !1, isFlipY: !1 };
        var l = U.instance(b),
          t = U.instance(b),
          q = U.instance(b),
          n = U.instance(b),
          p = U.instance({ isFloat: !0, width: m, isPot: !1, isFlipY: !1 }),
          x = 1 / c;
        return {
          process: function (A) {
            H.set("s37");
            n.o();
            W.l(y, !1);
            H.set("s38");
            for (var u = 0; u < e; ++u)
              l.o(),
                H.K("u10", x, 0),
                W.l(y, !1),
                q.o(),
                n.g(0),
                W.l(y, !1),
                t.o(),
                l.g(0),
                H.K("u10", 0, x),
                W.l(y, !1),
                n.o(),
                q.g(0),
                W.l(y, !1),
                u !== e - 1 && t.g(0);
            H.set("s39");
            p.o();
            A.g(0);
            t.g(1);
            n.g(2);
            W.l(y, !1);
            p.g(0);
          },
          wa: function () {
            return p;
          },
        };
      },
    },
    Va = {
      instance: function (b) {
        function e(x) {
          return U.instance({ isFloat: x, width: c.A, isPot: !1, isFlipY: !1 });
        }
        var c = Object.assign({ aa: 0.1, T: 9, A: 128, gain: 1, N: !1 }, b),
          m = e(!1),
          y = [e(!1), e(!1), e(!1)],
          l = [e(!1), e(!1), e(!1)],
          t = e(!0),
          q = [m, l[0], l[1]];
        b =
          "uniform sampler2D u1;const float e=1.1111,g=2.2222;uniform vec2 u31;varying vec2 vv0;void main(){float b=0.,c=0.;for(float a=-e;a<=e;a+=1.){vec2 i=u31*a,j=vv0+i*g;float d=1.2*a/e,f=exp(-d*d);b+=f*texture2D(u1,j).r,c+=f;}b/=c,gl_FragColor=vec4(b,0.,0.,1.);}"
            .replace("1.1111", Math.round((c.T - 1) / 2).toFixed(2))
            .replace("2.2222", (1 / c.A).toFixed(6));
        var n =
            "uniform sampler2D u32,u33,u34,u35;const float f=1.1111;const vec3 g=vec3(1.);const float h=2.2222;varying vec2 vv0;void main(){vec3 a=texture2D(u32,vv0).rgb;float c=texture2D(u33,vv0).r,d=texture2D(u34,vv0).r,i=texture2D(u35,vv0).r,j=a.r*a.r;vec3 b=vec3(c,d,i),k=max(g*f,abs(vec3(j)-b*b)),l=sqrt(k);gl_FragColor=vec4(a.r,h*(a-b)/l);}"
              .replace("1.1111", c.aa.toFixed(4))
              .replace("2.2222", c.gain.toFixed(4)),
          p = { u1: 0 };
        H.Da([
          {
            id: "s49",
            name: "_",
            h: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(.2126,.7152,.0722),g=vec3(1.);void main(){vec3 b=texture2D(u1,vv0).rgb;float a=dot(b,f);gl_FragColor=vec4(a,a,a,a);}",
            j: p,
            i: ["u1"],
            precision: "lowp",
          },
          {
            id: "s50",
            name: "_",
            h: b,
            j: p,
            i: ["u1", "u31"],
            precision: "lowp",
          },
          {
            id: "s51",
            name: "_",
            h: n,
            j: { u32: 0, u33: 1, u34: 2, u35: 3 },
            i: ["u32", "u33", "u34", "u35"],
            precision: "highp",
          },
        ]);
        return {
          process: function () {
            H.set("s49");
            m.G();
            W.l(c.N, !1);
            H.set("s50");
            for (var x = 0; 3 > x; ++x)
              H.K("u31", 1, 0),
                y[x].o(),
                q[x].g(0),
                W.l(!1, !1),
                H.K("u31", 0, 1),
                l[x].o(),
                y[x].g(0),
                W.l(!1, !1);
            H.set("s51");
            t.o();
            m.g(0);
            l[0].g(1);
            l[1].g(2);
            l[2].g(3);
            W.l(!1, !1);
            t.g(0);
          },
          wa: function () {
            return t;
          },
        };
      },
    },
    Wa = {
      instance: function (b) {
        function e(p) {
          return U.instance({ isFloat: p, width: c.A, isPot: !1, isFlipY: !1 });
        }
        var c = Object.assign({ aa: 0.1, T: 9, A: 128, gain: 1, N: !1 }, b),
          m = e(!1),
          y = e(!1),
          l = e(!1),
          t = e(!0);
        b =
          "uniform sampler2D u1;const float e=1.1111,g=2.2222;uniform vec2 u31;varying vec2 vv0;void main(){vec3 b=vec3(0.);float c=0.;for(float a=-e;a<=e;a+=1.){vec2 i=u31*a,j=vv0+i*g;float d=1.2*a/e,f=exp(-d*d);b+=f*texture2D(u1,j).rgb,c+=f;}b/=c,gl_FragColor=vec4(b,1.);}"
            .replace("1.1111", Math.round((c.T - 1) / 2).toFixed(2))
            .replace("2.2222", (1 / c.A).toFixed(6));
        var q =
            "uniform sampler2D u0,u36;const float f=1.1111;const vec3 g=vec3(1.);const float h=2.2222;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);vec3 c=texture2D(u36,vv0).rgb;float d=a.a*a.a;vec3 b=c.rgb,i=max(g*f,abs(vec3(d)-b*b)),j=sqrt(i);gl_FragColor=vec4(a.a,h*(a.rgb-b)/j);}"
              .replace("1.1111", c.aa.toFixed(4))
              .replace("2.2222", c.gain.toFixed(4)),
          n = { u1: 0 };
        H.Da([
          {
            id: "s52",
            name: "_",
            h: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(.2126,.7152,.0722),g=vec3(1.);void main(){vec3 a=texture2D(u1,vv0).rgb;float b=dot(a,f);gl_FragColor=vec4(a.rgb,b);}",
            j: n,
            i: ["u1"],
            precision: "lowp",
          },
          {
            id: "s53",
            name: "_",
            h: b,
            j: n,
            i: ["u1", "u31"],
            precision: "lowp",
          },
          {
            id: "s54",
            name: "_",
            h: q,
            j: { u0: 0, u36: 1 },
            i: ["u0", "u36"],
            precision: "highp",
          },
        ]);
        return {
          process: function () {
            H.set("s52");
            m.G();
            W.l(c.N, !1);
            H.set("s53");
            H.K("u31", 1, 0);
            y.o();
            m.g(0);
            W.l(!1, !1);
            H.K("u31", 0, 1);
            l.o();
            y.g(0);
            W.l(!1, !1);
            H.set("s54");
            t.o();
            m.g(0);
            l.g(1);
            W.l(!1, !1);
            t.g(0);
          },
          wa: function () {
            return t;
          },
        };
      },
    },
    Xa = {
      instance: function (b) {
        function e(x) {
          return U.instance({ isFloat: x, width: c.A, isPot: !1, isFlipY: !1 });
        }
        var c = Object.assign(
            { aa: 0.1, T: 9, A: 128, gain: 1, Kb: 0, xa: !1, N: !1 },
            b
          ),
          m = e(!1),
          y = null,
          l = null,
          t = null;
        c.xa && ((y = e(!1)), (l = e(!1)), (t = e(!0)));
        b = { u1: 0 };
        var q = [
          {
            id: "s55",
            name: "_",
            h: "uniform sampler2D u1;const float f=1.1111;varying vec2 vv0;const vec3 e=vec3(.2126,.7152,.0722);void main(){vec2 a=vv0*.5*(f+1.);float b=.5*(1.-f),c=dot(texture2D(u1,a).rgb,e),d=dot(texture2D(u1,a+vec2(0.,b)).rgb,e),h=dot(texture2D(u1,a+vec2(b,0.)).rgb,e),i=dot(texture2D(u1,a+vec2(b,b)).rgb,e);gl_FragColor=vec4(c,d,h,i);}".replace(
              "1.1111",
              c.Kb.toFixed(4)
            ),
            j: b,
            i: ["u1"],
            precision: "lowp",
          },
        ];
        if (c.xa) {
          var n =
              "uniform sampler2D u1;const float e=1.1111,g=2.2222;uniform vec2 u31;varying vec2 vv0;void main(){vec4 b=vec4(0.);float c=0.;for(float a=-e;a<=e;a+=1.){vec2 i=u31*a,j=vv0+i*g;float d=1.2*a/e,f=exp(-d*d);b+=f*texture2D(u1,j),c+=f;}gl_FragColor=b/c;}"
                .replace("1.1111", Math.round((c.T - 1) / 2).toFixed(2))
                .replace("2.2222", (1 / c.A).toFixed(6)),
            p =
              "uniform sampler2D u0,u36;const float f=1.1111;const vec4 g=vec4(1.);const float h=2.2222;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0),c=texture2D(u36,vv0),d=a*a,b=c,i=max(g*f,abs(d-b*b)),j=sqrt(i);gl_FragColor=h*(a-b)/j;}"
                .replace("1.1111", c.aa.toFixed(4))
                .replace("2.2222", c.gain.toFixed(4));
          q.push(
            {
              id: "s56",
              name: "_",
              h: n,
              j: b,
              i: ["u1", "u31"],
              precision: "lowp",
            },
            {
              id: "s57",
              name: "_",
              h: p,
              j: { u0: 0, u36: 1 },
              i: ["u0", "u36"],
              precision: "highp",
            }
          );
        }
        H.Da(q);
        return {
          process: function () {
            H.set("s55");
            m.G();
            W.l(c.N, !1);
            c.xa
              ? (H.set("s56"),
                H.K("u31", 1, 0),
                y.o(),
                m.g(0),
                W.l(!1, !1),
                H.K("u31", 0, 1),
                l.o(),
                y.g(0),
                W.l(!1, !1),
                H.set("s57"),
                t.o(),
                m.g(0),
                l.g(1),
                W.l(!1, !1),
                t.g(0))
              : m.g(0);
          },
          Gd: function () {
            return 2 - c.Kb;
          },
          wa: function () {
            return c.xa ? t : m;
          },
        };
      },
    };
  function fb(b, e) {
    b[e] = !0;
    b.setAttribute(e, "true");
  }
  function hb() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }
  function ib() {
    var b = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return b && b.length && 2 < b.length
      ? [parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3] || 0, 10)]
      : [0, 0, 0];
  }
  function jb() {
    var b = navigator.userAgent.toLowerCase();
    return -1 !== b.indexOf("safari") && -1 === b.indexOf("chrome") ? !0 : !1;
  }
  function kb() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      ? !0
      : !1;
  }
  function lb(b) {
    if (!b) return b;
    var e = null;
    if (b.video) {
      var c = function (m) {
        return m && "object" === typeof m ? Object.assign({}, m) : m;
      };
      e = {};
      "undefined" !== typeof b.video.width && (e.width = c(b.video.width));
      "undefined" !== typeof b.video.height && (e.height = c(b.video.height));
      "undefined" !== typeof b.video.facingMode &&
        (e.facingMode = c(b.video.facingMode));
    }
    e = { audio: b.audio, video: e };
    "undefined" !== typeof b.deviceId && mb(e, b.deviceId);
    return e;
  }
  function mb(b, e) {
    e &&
      ((b.video = b.video || {}),
      (b.video.deviceId = { exact: e }),
      b.video.facingMode && delete b.video.facingMode);
  }
  function nb(b) {
    var e = b.video.width;
    b.video.width = b.video.height;
    b.video.height = e;
    return b;
  }
  function ob(b) {
    function e(u) {
      return [
        480, 576, 640, 648, 720, 768, 800, 960, 1080, 1152, 1280, 1366, 1920,
      ].sort(function (D, r) {
        return Math.abs(D - u) - Math.abs(r - u);
      });
    }
    function c(u) {
      var D = lb(b);
      u = u(D);
      y.push(u);
      m(u);
    }
    function m(u) {
      if (u.video && u.video.facingMode && u.video.facingMode.exact) {
        var D = u.video.facingMode.exact;
        u = lb(u);
        delete u.video.facingMode.exact;
        u.video.facingMode.ideal = D;
        y.push(u);
      }
    }
    var y = [];
    if (!b || !b.video) return y;
    m(b);
    if (b.video.width && b.video.height) {
      if (b.video.width.ideal && b.video.height.ideal) {
        var l = e(b.video.width.ideal).slice(0, 3),
          t = e(b.video.height.ideal).slice(0, 3),
          q = {},
          n = 0;
        for (q.ca = void 0; n < l.length; q = { ca: q.ca }, ++n) {
          q.ca = l[n];
          var p = {},
            x = 0;
          for (p.ba = void 0; x < t.length; p = { ba: p.ba }, ++x)
            if (
              ((p.ba = t[x]),
              q.ca !== b.video.width.ideal || p.ba !== b.video.height.ideal)
            ) {
              var A = Math.max(q.ca, p.ba) / Math.min(q.ca, p.ba);
              A < 4 / 3 - 0.1 ||
                A > 16 / 9 + 0.1 ||
                c(
                  (function (u, D) {
                    return function (r) {
                      r.video.width.ideal = u.ca;
                      r.video.height.ideal = D.ba;
                      return r;
                    };
                  })(q, p)
                );
            }
        }
      }
      c(function (u) {
        return nb(u);
      });
    }
    b.video.width &&
      b.video.height &&
      (b.video.width.ideal &&
        b.video.height.ideal &&
        c(function (u) {
          delete u.video.width.ideal;
          delete u.video.height.ideal;
          return u;
        }),
      c(function (u) {
        delete u.video.width;
        delete u.video.height;
        return u;
      }));
    b.video.facingMode &&
      (c(function (u) {
        delete u.video.facingMode;
        return u;
      }),
      b.video.width &&
        b.video.height &&
        c(function (u) {
          nb(u);
          delete u.video.facingMode;
          return u;
        }));
    y.push({ audio: b.audio, video: !0 });
    return y;
  }
  function pb(b) {
    try {
      var e = window.matchMedia("(orientation: portrait)").matches ? !0 : !1;
    } catch (m) {
      e = window.innerHeight > window.innerWidth;
    }
    if (e && b && b.video) {
      e = b.video.width;
      var c = b.video.height;
      e &&
        c &&
        e.ideal &&
        c.ideal &&
        e.ideal > c.ideal &&
        ((b.video.height = e), (b.video.width = c));
    }
  }
  function qb(b) {
    b.volume = 0;
    fb(b, "muted");
    if (jb()) {
      if (1 === b.volume) {
        var e = function () {
          b.volume = 0;
          window.removeEventListener("mousemove", e, !1);
          window.removeEventListener("touchstart", e, !1);
        };
        window.addEventListener("mousemove", e, !1);
        window.addEventListener("touchstart", e, !1);
      }
      setTimeout(function () {
        b.volume = 0;
        fb(b, "muted");
      }, 5);
    }
  }
  function rb(b, e, c) {
    return null === b
      ? Promise.resolve()
      : new Promise(function (m, y) {
          if (b.srcObject && b.srcObject.getVideoTracks) {
            var l = b.srcObject.getVideoTracks();
            1 !== l.length
              ? y("INVALID_TRACKNUMBER")
              : ((l = l[0]), e ? sb(b, m, y, c) : (l.stop(), m()));
          } else y("BAD_IMPLEMENTATION");
        });
  }
  function tb(b, e, c, m) {
    function y(t) {
      l || ((l = !0), c(t));
    }
    var l = !1;
    navigator.mediaDevices
      .getUserMedia(m)
      .then(function (t) {
        function q() {
          setTimeout(function () {
            if (b.currentTime) {
              var p = b.videoHeight;
              if (0 === b.videoWidth || 0 === p) y("VIDEO_NULLSIZE");
              else {
                var x = { ld: null, De: null, Zd: null };
                try {
                  var A = t.getVideoTracks()[0];
                  A &&
                    ((x.Zd = A),
                    (x.ld = A.getCapabilities()),
                    (x.De = A.getSettings()));
                } catch (u) {}
                jb() || hb()
                  ? b.parentNode && null !== b.parentNode
                    ? (l || e(b, t, x),
                      setTimeout(function () {
                        b.play();
                      }, 100))
                    : (document.body.appendChild(b),
                      qb(b),
                      setTimeout(function () {
                        b.style.transform = "scale(0.0001,0.0001)";
                        b.style.position = "fixed";
                        b.style.bottom = "0px";
                        b.style.right = "0px";
                        qb(b);
                        setTimeout(function () {
                          b.play();
                          l || e(b, t, x);
                        }, 100);
                      }, 80))
                  : l || e(b, t, x);
              }
            } else y("VIDEO_NOTSTARTED");
          }, 700);
        }
        function n() {
          b.removeEventListener("loadeddata", n, !1);
          var p = b.play();
          qb(b);
          "undefined" === typeof p
            ? q()
            : p
                .then(function () {
                  q();
                })
                .catch(function () {
                  y("VIDEO_PLAYPROMISEREJECTED");
                });
        }
        "undefined" !== typeof b.srcObject
          ? (b.srcObject = t)
          : ((b.src = window.URL.createObjectURL(t)), (b.videoStream = t));
        qb(b);
        b.addEventListener("loadeddata", n, !1);
      })
      .catch(function (t) {
        y(t);
      });
  }
  function sb(b, e, c, m) {
    if (b)
      if (kb()) {
        if (m && m.video && hb()) {
          var y = ib();
          0 !== y[0] && (12 > y[0] || (12 === y[0] && 2 > y[1])) && pb(m);
        }
        fb(b, "autoplay");
        fb(b, "playsinline");
        m && m.audio ? (b.volume = 0) : fb(b, "muted");
        tb(
          b,
          e,
          function () {
            function l(q) {
              if (0 === q.length) c("INVALID_FALLBACKCONSTRAINTS");
              else {
                var n = q.shift();
                tb(
                  b,
                  e,
                  function () {
                    l(q);
                  },
                  n
                );
              }
            }
            var t = ob(m);
            l(t);
          },
          m
        );
      } else c && c("MEDIASTREAMAPI_NOTFOUND");
    else c && c("VIDEO_NOTPROVIDED");
  }
  var ub = (function () {
      function b() {
        c(B + D.Db);
        g.port.postMessage("DONE");
      }
      function e() {
        K.Ea = 0 === D.sa ? I(c) : I(m);
      }
      function c(w) {
        f.ka &&
          null !== r &&
          ((w -= B),
          (w = Math.min(Math.max(w, D.ec[0]), D.ec[1])),
          (B += w),
          l(),
          v.isEnabled && v.ya && f.O && B - v.zb > D.Xb && (p(), (v.zb = B)),
          r(B));
      }
      function m(w) {
        f.ka && (K.timeout = setTimeout(c.bind(null, w), D.sa));
      }
      function y() {
        r = null;
        f.ka = !1;
        l();
      }
      function l() {
        K.Ea && (window.cancelAnimationFrame(K.Ea), (K.Ea = null));
        K.timeout && (window.clearTimeout(K.timeout), (K.timeout = null));
      }
      function t(w) {
        w && !f.O
          ? ((f.O = !0),
            J && PerformanceManager.$f(),
            g.port.postMessage("STOP"),
            N.Yc(!0),
            e())
          : !w &&
            f.O &&
            ((f.O = !1),
            J && PerformanceManager.Qf(1),
            N.Yc(!1),
            g.port.postMessage("START"));
      }
      function q(w) {
        w.target.hidden ? C() : E();
      }
      function n(w, h, k) {
        h = w.createShader(h);
        w.shaderSource(h, k);
        w.compileShader(h);
        return h;
      }
      function p() {
        v.ya = !1;
        var w = v.W,
          h = v.Pa,
          k = v.Qa,
          d = v.M;
        w.uniform1f(v.tc, Math.random());
        v.la ? h.beginQueryEXT(d, k) : w.beginQuery(d, k);
        w.drawElements(w.POINTS, 1, w.UNSIGNED_SHORT, 0);
        v.la ? h.endQueryEXT(d) : w.endQuery(d);
        N.flush();
        A()
          .then(function (F) {
            0 === F || isNaN(F)
              ? ((v.isEnabled = !1),
                console.log(
                  "WARNING in benchmark_GPUClock: WebGL timer queries is not working properly. timeElapsedNs =",
                  F
                ))
              : ((F = (D.$c * D.Wb * 1e3) / F),
                (v.eb = (v.eb + 1) % D.qa),
                (v.Ab[v.eb] = F),
                ++v.Dc > D.qa &&
                  (v.Ta.set(v.Ab),
                  v.Ta.sort(function (M, O) {
                    return M - O;
                  }),
                  (F = v.Ta[Math.floor(D.qa / 2)]),
                  (v.Ka = Math.max(v.Ka, F)),
                  D.Vb(F / v.Ka)),
                (v.ya = !0));
          })
          .catch(function () {
            v.ya = !0;
          });
      }
      function x(w) {
        var h = v.W,
          k = v.Pa,
          d = v.Qa;
        d = v.la
          ? k.bf(d, k.QUERY_RESULT_AVAILABLE_EXT)
          : h.getQueryParameter(d, h.QUERY_RESULT_AVAILABLE);
        h = h.getParameter(k.GPU_DISJOINT_EXT);
        d ? w(!h) : setTimeout(x.bind(null, w), 0.1);
      }
      function A() {
        return new Promise(function (w, h) {
          x(function (k) {
            if (k) {
              k = v.W;
              var d = v.Pa,
                F = v.Qa;
              k = v.la
                ? d.getQueryObjectEXT(F, d.QUERY_RESULT_EXT)
                : k.getQueryParameter(F, k.QUERY_RESULT);
              w(k);
            } else h();
          });
        });
      }
      var u = {
          Ac: !0,
          ec: [1, 200],
          Db: 20,
          sa: 0,
          Wb: 50,
          $c: 240,
          Xb: 3e3,
          qa: 3,
          Vb: null,
        },
        D = null,
        r = null,
        B = 0,
        g = null,
        J = !1,
        I = null,
        f = { fa: !1, O: !0, yb: !1, xb: !1, wb: !1, ka: !1 },
        K = { Ea: null, timeout: null },
        v = {
          isEnabled: !1,
          ya: !1,
          W: null,
          Pa: null,
          Qa: null,
          M: null,
          tc: null,
          la: !0,
          zb: 0,
          Dc: 0,
          Ab: null,
          Ta: null,
          eb: 0,
          Ka: 0,
        },
        E = t.bind(null, !0),
        C = t.bind(null, !1),
        L = {
          s: function (w) {
            D = Object.assign(u, w);
            Object.assign(f, { O: !0, fa: !0, ka: !1 });
            I =
              window.requestPostAnimationFrame || window.requestAnimationFrame;
            if (null !== D.Vb) {
              w = document.createElement("canvas");
              w.setAttribute("width", "1");
              w.setAttribute("height", "1");
              var h = { antialias: !1 };
              w = w.getContext("webgl2", h) || w.getContext("webgl", h);
              if (
                (h =
                  w.getExtension("EXT_disjoint_timer_query") ||
                  w.getExtension("EXT_disjoint_timer_query_webgl2"))
              ) {
                v.W = w;
                v.Pa = h;
                v.isEnabled = !0;
                v.la = h.beginQueryEXT ? !0 : !1;
                var k = n(
                    w,
                    w.VERTEX_SHADER,
                    "attribute vec4 a0;void main(){gl_Position=a0;}"
                  ),
                  d = n(
                    w,
                    w.FRAGMENT_SHADER,
                    "precision lowp float;uniform float u37;void main(){vec4 a=u37*vec4(1.,2.,3.,4.);for(int b=0;b<666;b+=1)a=cos(a);gl_FragColor=a;}".replace(
                      "666",
                      D.Wb.toString()
                    )
                  ),
                  F = w.createProgram();
                w.attachShader(F, k);
                w.attachShader(F, d);
                w.linkProgram(F);
                k = w.getAttribLocation(F, "a0");
                v.tc = w.getUniformLocation(F, "u37");
                w.useProgram(F);
                w.enableVertexAttribArray(k);
                F = w.createBuffer();
                w.bindBuffer(w.ARRAY_BUFFER, F);
                w.bufferData(
                  w.ARRAY_BUFFER,
                  new Float32Array([0.5, 0.5, 0, 1]),
                  w.STATIC_DRAW
                );
                w.vertexAttribPointer(k, 4, w.FLOAT, !1, 16, 0);
                F = w.createBuffer();
                w.bindBuffer(w.ELEMENT_ARRAY_BUFFER, F);
                w.bufferData(
                  w.ELEMENT_ARRAY_BUFFER,
                  new Uint16Array([0]),
                  w.STATIC_DRAW
                );
                w.disable(w.DEPTH_TEST);
                w.disable(w.DITHER);
                w.disable(w.STENCIL_TEST);
                w.viewport(0, 0, 1, 1);
                F = v.la ? h.createQueryEXT() : w.createQuery();
                v.Qa = F;
                v.M = h.TIME_ELAPSED_EXT || w.TIME_ELAPSED;
                v.zb = -D.Xb;
                v.Ab = new Float32Array(D.qa);
                v.Ta = new Float32Array(D.qa);
                v.Ka = 0;
                v.eb = 0;
                v.Dc = 0;
                v.ya = !0;
              }
            }
            if (D.Ac) {
              w = !1;
              try {
                if ("undefined" === typeof SharedWorker) {
                  var M = URL.createObjectURL(
                      new Blob(
                        [
                          "let handler = null;\n      self.addEventListener('message', function(e){\n        if (handler !== null){\n          clearTimeout(handler);\n          handler = null;\n        }\n        switch (e.data) {\n          case 'START':\n          case 'DONE':\n            handler = setTimeout(function(){\n              self.postMessage('TICK');\n            }, " +
                            D.Db.toString() +
                            ");\n            break;\n          case 'STOP':\n            break;\n        };\n      }, false);",
                        ],
                        { type: "text/javascript" }
                      )
                    ),
                    O = new Worker(M);
                  O.addEventListener("message", b);
                  g = { Kc: O, port: O };
                  f.yb = !0;
                } else {
                  var V = URL.createObjectURL(
                      new Blob(
                        [
                          "let handler = null;\n      onconnect = function(e) {\n        const port = e.ports[0];\n        port.addEventListener('message', function(e) {\n          \n          if (handler !== null){\n            clearTimeout(handler);\n            handler = null;\n          }\n          switch (e.data) {\n            case 'START':\n            case 'DONE':\n              handler = setTimeout(function(){\n                port.postMessage('TICK');\n              }, " +
                            D.Db.toString() +
                            ");\n              break;\n            case 'STOP':\n              break;\n          };\n          \n        });\n        \n        port.start();\n      } // end onconnect()",
                        ],
                        { type: "text/javascript" }
                      )
                    ),
                    da = new SharedWorker(V);
                  da.port.start();
                  da.port.addEventListener("message", b);
                  g = { Kc: da, port: da.port };
                  f.xb = !0;
                }
                w = !0;
              } catch (ea) {}
              w &&
                ("onvisibilitychange" in document
                  ? document.addEventListener("visibilitychange", q)
                  : (window.addEventListener("blur", C),
                    window.addEventListener("focus", E)),
                window.addEventListener("pagehide", C),
                window.addEventListener("pageshow", E),
                (f.wb = !0));
            }
            J = "undefined" !== typeof PerformanceManager;
          },
          m: function () {
            y();
            f.wb &&
              ("onvisibilitychange" in document
                ? document.removeEventListener("visibilitychange", q)
                : (window.removeEventListener("blur", C),
                  window.removeEventListener("focus", E)),
              window.removeEventListener("pagehide", C),
              window.removeEventListener("pageshow", E),
              (f.wb = !1));
            f.xb
              ? (g.port.close(), (f.xb = !1))
              : f.yb && (g.Kc.terminate(), (f.yb = !1));
            Object.assign(f, { O: !0, fa: !1, ka: !1 });
            r = null;
          },
          Jf: function () {
            return f.O;
          },
          update: function (w) {
            Object.assign(D, w);
          },
          ke: function (w) {
            f.fa || L.s({});
            l();
            f.ka = !0;
            r = w;
            f.O && e();
          },
          stop: y,
        };
      return L;
    })(),
    vb = (function () {
      function b(A, u) {
        var D = A[0] - 0.5;
        A = A[1] - 0.5;
        var r = u[0] - 0.5;
        u = u[1] - 0.5;
        return D * D + A * A - (r * r + u * u);
      }
      var e = {
          Fc: 4,
          Wa: [1.5, 1.5, 2],
          $: [0.1, 0.1, 0.1],
          Oc: 1,
          A: -1,
          sb: -1,
          Fe: 2,
          ae: 1,
          Lb: !0,
          wd: 0.8,
        },
        c = null,
        m = [],
        y = [],
        l = [],
        t = [0],
        q = [0.5, 0.5, 1],
        n = null,
        p = 0,
        x = [0, 0, 0];
      return {
        s: function (A) {
          c = Object.assign({}, e, A);
          m.splice(0);
          y.splice(0);
          l.splice(0);
          p = 0;
          A = c.Wa[0] * c.$[0];
          var u = c.Wa[1] * c.$[1],
            D = 1 / (1 + c.Wa[2] * c.$[2]),
            r = c.Oc * Math.min(c.A, c.sb),
            B = r / c.A;
          r /= c.sb;
          var g = 0.5 * c.wd;
          g *= g;
          for (var J = 0; J < c.Fc; ++J) {
            var I = [];
            y.push(I);
            var f = Math.pow(D, J),
              K = B * f,
              v = r * f;
            f = K * c.ae;
            l.push(f);
            var E = K * A,
              C = v * u;
            K /= 2;
            v /= 2;
            for (
              var L = 1 + (1 - K - K) / E, w = 1 + (1 - v - v) / C, h = 0;
              h < w;
              ++h
            )
              for (var k = v + h * C, d = k - 0.5, F = 0; F < L; ++F) {
                var M = K + F * E,
                  O = M - 0.5;
                O * O + d * d > g || ((M = [M, k, f]), m.push(M), I.push(M));
              }
            c.Lb && I.sort(b);
            n = m;
          }
          c.Lb && m.sort(b);
        },
        get: function (A) {
          var u = n.length;
          if (0 === u) return q;
          for (; A >= t.length; ) t.push(0);
          t[A] >= u && (t[A] = 0);
          var D = n[Math.floor(t[A]) % u];
          t[A] = (t[A] + 1 / c.Fe) % u;
          if (0 === p) return D;
          x[0] = D[0];
          x[1] = D[1];
          x[2] = p;
          return x;
        },
        Lf: function (A) {
          A >= t.length || (t[A] = Math.floor(Math.random() * n.length));
        },
        Rf: function (A) {
          p = A;
          if (0 === p) n = m;
          else {
            for (var u = l.length, D = u - 1, r = 0; r < u; ++r)
              if (l[r] <= A) {
                D = r;
                break;
              }
            n = y[D];
          }
        },
        reset: function () {
          for (var A = m.length / t.length, u = 0; u < t.length; ++u)
            t[u] = Math.floor(u * A);
          p = 0;
          n = m;
        },
      };
    })(),
    wb = {
      qc: function () {
        return Date.now();
      },
      ef: function () {
        return performance.now();
      },
    },
    X = {
      neuralNetworkPath: "NNC.json",
      sa: 10,
      Nd: 64,
      width: 400,
      height: 400,
      oe: [2, 2, 3],
      me: 3,
      pe: 0.7,
      Je: [0.2, 0.2, 0.3],
      $: [0.7, 0.7, 1],
      Ie: 55,
      le: [0.1, 1.1],
      ad: 1,
      Ee: 0.9,
      ce: 100,
      na: [0.2, 0.8],
      Rc: 0.1,
      qe: 0.55,
      sd: 1,
      Ne: 20,
      qd: !0,
    };
  function xb(b) {
    function e() {
      ++v;
      1 === v &&
        (vb.s({ Wa: X.oe, Fc: X.me, A: n, sb: p, Oc: X.pe, $: u, Lb: !0 }),
        w.Ge(),
        (yb.ready = !0),
        b.hd(!1, {
          video: B.element,
          GL: a,
          videoTexture: B.pa.get(),
          videoTextureCut: r.Ra.get(),
        }),
        I !== J.pause && (ub.stop(), (I = J.play), c(0)),
        (v = 0));
    }
    function c() {
      I !== J.pause &&
        (X.qd
          ? y().then(function () {
              m();
              t();
            })
          : (m(), y().then(t)));
    }
    function m() {
      S.reset();
      S.S();
      var h = B.element.currentTime - L;
      0 > h && (L = B.element.currentTime);
      1e3 * h < X.Ne ||
        (B.pa.refresh(),
        (L += h),
        H.set("s59"),
        B.bb.G(),
        B.pa.g(0),
        W.l(!1, !0));
      for (h = 0; h < X.ad; ++h)
        H.set("s60"), r.Ra.G(), B.bb.g(0), r.Ba.g(1), W.l(!1, !1), A.J(r.Ra);
    }
    function y() {
      var h = wb.qc();
      if (h - x < X.ce) return Promise.resolve();
      x = h;
      H.set("s1");
      S.H();
      a.viewport(0, 0, 1, 1);
      r.Cb.g(0);
      W.l(!1, !1);
      return N.Ya(0, 0, 1, 1, g).then(l);
    }
    function l() {
      var h = X.na[0] + C * (X.na[1] - X.na[0]),
        k = Math.abs((g[1] / 255) * 2 - 1),
        d = 128 < g[0],
        F = d && k < h + X.Rc;
      h = d && k < h - X.Rc;
      I === J.play && h
        ? (b.ac(!0), (I = J.lb))
        : I !== J.lb || F || (b.ac(!1), (I = J.play));
    }
    function t() {
      K === f.visible &&
        (S.Le(), H.set("s58"), B.bb.g(1), r.Ba.g(0), W.l(!1, !1));
      a.flush();
      ub.ke(c);
    }
    function q() {
      r.Ba.Tc(1);
      H.set("s61");
      H.ze("u38", vb.get(0));
      W.l(!1, !1);
      H.set("s62");
      r.Cb.re(1);
      r.Ba.g(0);
      W.l(!1, !1);
    }
    var n = Math.round(X.width),
      p = Math.round(X.height),
      x = wb.qc(),
      A = null,
      u = null,
      D = [1, n / p],
      r = { Ra: null, Ba: null, Cb: null, Ze: null },
      B = { element: null, pa: null, bb: null, ib: null },
      g = new Uint8Array([0, 0, 0, 0]),
      J = { $d: -1, Xd: 0, play: 1, lb: 2, pause: 3 },
      I = J.Xd,
      f = { hidden: 0, visible: 1 },
      K = b.Qd ? f.visible : f.hidden,
      v = 0,
      E = "undefined" !== typeof b.Yb ? b.Yb : "../../",
      C =
        (("undefined" !== typeof b.Qc ? b.Qc : X.qe) - X.na[0]) /
        (X.na[1] - X.na[0]),
      L = 0,
      w = {
        VERSION: "2.0.2",
        we: function (h) {
          C = h;
        },
        He: function (h) {
          K = h ? f.visible : f.hidden;
        },
        Xc: function (h, k) {
          if ((h && I === J.pause) || (!h && I !== J.pause))
            return Promise.resolve();
          k = k ? rb(B.element, !h, B.ib) : Promise.resolve();
          h
            ? ((I = J.pause), ub.stop())
            : ((I = J.lb), ub.stop(), (I = J.play), c(0));
          return k;
        },
        rd: function () {
          A && (A.m(), (A = null));
          Ma.m();
          I = J.$d;
        },
        s: function () {
          B.ib = {
            video: {
              facingMode: { ideal: "user" },
              width: { min: 480, max: 1280, ideal: 800 },
              height: { min: 480, max: 1280, ideal: 600 },
            },
            audio: !1,
          };
          sb(
            kb() ? document.createElement("video") : !1,
            function (h) {
              w.start(h);
            },
            function () {
              errorCallback("NO_WEBCAM");
            },
            B.ib
          );
        },
        start: function (h) {
          B.element = h;
          w.Md();
          w.pd();
          w.Be();
          ja(E + X.neuralNetworkPath)
            .then(w.Wd)
            .then(e);
        },
        Md: function () {
          H.Da([
            {
              id: "s59",
              name: "_",
              Ca: "attribute vec2 a0;uniform vec2 u39,u40;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=u40+u39*a0;}",
              Fa: ["a0"],
              ta: [2],
              h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
              i: ["u1", "u39", "u40"],
              precision: "lowp",
            },
            {
              id: "s60",
              name: "_",
              h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
              Ca: "attribute vec2 a0;uniform sampler2D u41;uniform vec2 u42;const vec2 f=vec2(.25,.5),g=vec2(.75,.5),e=vec2(.5,.5);varying vec2 vv0;void main(){vec4 a=texture2D(u41,f);vec2 d=a.gb,b=a.a*u42;vec4 c=texture2D(u41,g);float l=c.a,i=c.y;vec2 j=vec2(1./cos(i),1.);b*=j;vec2 k=a0*.5+e;vv0=d+(k-e)*b,gl_Position=vec4(a0,0.,1.);}",
              Fa: ["a0"],
              ta: [2],
              i: ["u1", "u41", "u42"],
              precision: "lowp",
            },
            {
              id: "s61",
              name: "_",
              Ca: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
              h: "uniform sampler2D u43,u41;uniform vec3 u38,u44;uniform vec2 u45;uniform float u46,u47;const vec4 e=vec4(.25,.25,.25,.25);const float f=1e-3;void main(){vec4 b=texture2D(u41,vec2(.25,.5));float a=floor(b.r+f),c=0.;vec4 d=texture2D(u43,vec2(.125,.625)),g=texture2D(u43,vec2(.375,.625));bool h=dot(d-g,e)>u47;h?a=2.:a>u46?a=0.:a>1.9&&(b.a>u45.y||b.a<u45.x)?a=0.:a>1.9?a+=1.:0.;if(a<.9)b.gba=u38,a=1.;else{float i=dot(e,texture2D(u43,vec2(.375,.875))),j=dot(e,texture2D(u43,vec2(.625,.875))),k=dot(e,texture2D(u43,vec2(.875,.875))),l=dot(e,texture2D(u43,vec2(.125,.875)));c=clamp(l,-1.+f,1.-f);float m=step(1.5,a);a*=m;float n=b.a;b.gba+=vec3(i,j,k)*u44*n;}b.r=a+c*.5+.5,gl_FragColor=b;}",
              i: "u43 u41 u38 u45 u46 u47 u44".split(" "),
            },
            {
              id: "s62",
              name: "_",
              h: "uniform sampler2D u41,u48;uniform float u49;varying vec2 vv0;const vec2 e=vec2(.5,.5);void main(){vec4 a=texture2D(u41,e),b=texture2D(u48,e);float c=step(2.,a.r),d=fract(a.r);vec4 f=vec4(c,d,0.,1.);gl_FragColor=mix(f,b,u49);}",
              i: ["u41", "u48", "u49"],
            },
            {
              id: "s58",
              name: "_",
              h: "uniform sampler2D u41,u50;uniform vec2 u42;varying vec2 vv0;const vec2 j=vec2(1.,1.);const vec3 k=vec3(0.,.7,1.);void main(){vec4 f=texture2D(u41,vec2(.5,.5));vec3 l=texture2D(u50,vv0).rgb;vec2 g=f.gb;float m=f.a;vec2 a=m*u42,c=g+a,d=g;d-=a/2.,c-=a/2.;vec2 n=.5*(d+c),h=step(d,vv0)*step(vv0,c);float o=h.x*h.y;vec2 b=2.*abs(n-vv0)/a;b=pow(b,3.*j);float i=max(b.x,b.y);i*=o,gl_FragColor=vec4(mix(l,k,i),1.);}",
              i: ["u41", "u50", "u42"],
            },
          ]);
        },
        Ge: function () {
          H.Z("s60", [
            { type: "1i", name: "u1", value: 0 },
            { type: "1i", name: "u41", value: 1 },
            { type: "2f", name: "u42", value: D },
          ]);
          H.Z("s62", [
            { type: "1i", name: "u41", value: 0 },
            { type: "1i", name: "u48", value: 1 },
            { type: "1f", name: "u49", value: X.Ee },
          ]);
          H.Z("s58", [
            { type: "1i", name: "u41", value: 0 },
            { type: "1i", name: "u50", value: 1 },
            { type: "2f", name: "u42", value: D },
          ]);
          H.Z("s61", [
            { type: "1i", name: "u43", value: 0 },
            { type: "1i", name: "u41", value: 1 },
            { type: "2f", name: "u45", value: X.le },
            { type: "1f", name: "u46", value: X.Ie },
            { type: "1f", name: "u47", value: X.sd },
            {
              type: "3f",
              name: "u44",
              value: [u[0] * D[0], u[1] * D[1], u[2]],
            },
          ]);
        },
        pd: function () {
          B.pa = U.instance({
            B: B.element,
            isPot: !1,
            isFloat: !1,
            isFlipY: !0,
          });
          B.bb = U.instance({
            isPot: !1,
            Kf: !0,
            isFloat: !1,
            width: n,
            height: p,
          });
          r.Ra = U.instance({ isPot: !0, isFloat: !1, width: X.Nd });
          var h = {
            width: 1,
            height: 1,
            isFloat: !0,
            isPot: !1,
            array: new Float32Array([0, 0.5, 0.5, 0]),
          };
          r.Ba = Ta.instance(h);
          h = {
            width: 1,
            height: 1,
            isFloat: !0,
            isPot: !1,
            array: new Float32Array([0, 0.5, 0, 1]),
          };
          r.Cb = Ta.instance(h);
        },
        Be: function () {
          var h = [0.5, 0.5],
            k = B.element.videoHeight / B.element.videoWidth,
            d = Ma.L() / Ma.D();
          k > d
            ? 1 >= k
              ? (h[0] *= k)
              : (h[1] /= k)
            : ((h[0] *= k), (k = 1 / d), (h[0] *= k), (h[1] *= k));
          h[1] *= d;
          H.Z("s59", [
            { type: "1i", name: "u1", value: 0 },
            { type: "2f", name: "u39", value: h },
            { type: "2f", name: "u40", value: [0.5, 0.5] },
          ]);
        },
        Wd: function (h) {
          return new Promise(function (k) {
            var d = "object" === typeof h ? h : JSON.parse(h);
            u = X.Je.slice(0);
            d.exportData && (u = d.exportData.translationScalingFactors || u);
            u[0] *= X.$[0];
            u[1] *= X.$[1];
            u[2] *= X.$[2];
            A = new eb({ Ua: d.layers, Jb: "gpuRawAvg", Fb: q });
            k();
          });
        },
      };
    return w;
  }
  var yb = {
    ready: !1,
    set_sensibility: function (b) {
      yb.ready && yb.ha.we(b);
    },
    toggle_pause: function (b, e) {
      return yb.ready ? yb.ha.Xc(b, e) : Promise.reject();
    },
    destroy: function () {
      ub.m();
      return new Promise(function (b) {
        yb.ha
          .Xc(!0, !0)
          .catch(function () {})
          .finally(function () {
            yb.ha.rd();
            b();
          });
      });
    },
    toggle_display: function (b) {
      yb.ready && yb.ha.He(b);
    },
    init: function (b) {
      function e(c) {
        b.callbackReady && b.callbackReady(c ? c : "UNKNOW_ERROR");
      }
      yb.ha = xb({
        Qd: "undefined" === typeof b.isDisplayVideo ? !0 : b.isDisplayVideo,
        hd: function (c, m) {
          b.callbackReady && b.callbackReady(c, m);
        },
        ac: b.callbackTrack,
        Qc: b.sensibility,
        Yb: "http://localhost:8080/",
      });
      ub.s({ Ac: !1, sa: X.sa });
      if (
        !Ma.s({
          kb: b.canvasId,
          width: X.width,
          height: X.height,
          debug: !1,
          xc: !1,
          premultipliedAlpha: !0,
        })
      )
        return e && e("COMPAT_FAIL"), !1;
      H.s();
      yb.ha.s();
      return !0;
    },
  };
  window.JEELIZGLANCETRACKER = yb;
  return JEELIZGLANCETRACKER || window.JEELIZGLANCETRACKER;
})();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////\/\/\/\/\/\/\/\/\/\/\BELOW ADDED/\/\/\/\/\/\/\/\/\/\/\/\/\///////////
////\/\/\/\/\/\/\/\/\/\/\BELOW ADDED/\/\/\/\/\/\/\/\/\/\/\/\/\///////////

console.log(JEELIZGLANCETRACKER);

function init_glanceTracking() {
  let isTracking = false;
  let startTime;
  let totalTime = 0;

  const toggleTracking = (enabled) => {
    if (enabled) {
      startTime = Date.now();
      if (totalTime > 0) {
        startTime -= totalTime;
        totalTime = 0;
      }
    } else {
      totalTime = Date.now() - startTime;
    }
    isTracking = enabled;
  };

  JEELIZGLANCETRACKER.init({
    callbackTrack: function (isDetected) {
      console.log("DETECTION changed ! isDetected = ", isDetected);
      const DOMvideo = document.getElementsByTagName("video")[0];
      if (!DOMvideo) return;

      if (isDetected) {
        DOMvideo.play();
        if (!isTracking) {
          console.log("User detected! Starting timer...");
          toggleTracking(true);
        }
      } else {
        DOMvideo.pause();
        if (isTracking) {
          console.log("User not detected! Stopping timer...");
          toggleTracking(false);
        }
      }
    },

    callbackReady: function (error) {
      if (error) {
        alert("AN ERROR HAPPENS :( CODE =" + error);
        return;
      }
      console.log("JEELIZGLANCETRACKER is READY YEAH!");
    },

    isDisplayVideo: true,
    canvasId: "glanceTrackerCanvas",
  });

  // Send the updated total time to the popup every second
  setInterval(function () {
    if (isTracking) {
      const elapsedTime = Date.now() - startTime;
      chrome.runtime.sendMessage({ totalTime: elapsedTime });
    }
  }, 1000);
}





//   function controlTracking(command) {
//     switch (command) {
//       case 'startTracking':
//         JEELIZGLANCETRACKER.init({
//           callbackTrack: function (isDetected) {
//             console.log("DETECTION changed ! isDetected ::: ", isDetected);
//             const DOMvideo = document.getElementsByTagName("video")[0];
//             if (!DOMvideo) return;
//             if (isDetected) {
//               DOMvideo.play();
//             } else {
//               DOMvideo.pause();
//             }
//           },
//           // Other configurations...
//         });
//         break;
//       case 'stopTracking':
//         JEELIZGLANCETRACKER.destroy();
//         break;
//       default:
//         break;
//     }
//   }

//   // Listen for messages from the popup
//   chrome.runtime.onMessage.addListener(function (message) {
//     if (message.command) {
//       controlTracking(message.command);
//     }
//   });

// let isTracking = false;
// let startTime;

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.command === 'startTracking') {
//     isTracking = true;
//     startTime = Date.now();
//   } else if (message.command === 'stopTracking') {
//     isTracking = false;
//     const elapsedTime = Date.now() - startTime;
//     console.log('User looked at the camera for:', elapsedTime, 'milliseconds');
//   }
// });

// // Track user's attention every second
// setInterval(function () {
//   if (isTracking) {
//     const elapsedTime = Date.now() - startTime;
//     console.log('User has been looking for:', elapsedTime, 'milliseconds');
//   }
// }, 1000);


////\/\/\/\/\/\/\/\/\/\/\ABOVE ADDED/\/\/\/\/\/\/\/\/\/\/\/\/\///////////
////\/\/\/\/\/\/\/\/\/\/\ABOVE ADDED/\/\/\/\/\/\/\/\/\/\/\/\/\///////////



 //end init()

init_glanceTracking();

////\/\/\/\/\/\/\/\/\/\/\BELOW ADDED/\/\/\/\/\/\/\/\/\/\/\/\/\///////////
////\/\/\/\/\/\/\/\/\/\/\BELOW ADDED/\/\/\/\/\/\/\/\/\/\/\/\/\///////////
const script = document.createElement('script');
script.textContent = `(${init_glanceTracking.toString()})();`;
(document.head || document.documentElement).appendChild(script);
script.remove();
////\/\/\/\/\/\/\/\/\/\/\ABOVE ADDED/\/\/\/\/\/\/\/\/\/\/\/\/\///////////
////\/\/\/\/\/\/\/\/\/\/\ABOVE ADDED/\/\/\/\/\/\/\/\/\/\/\/\/\///////////
