export const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    
    uniform float uLength;
    uniform float uShaftGirth;
    uniform float uBaseGirth;
    uniform float uCurvature;
    uniform float uCurvatureAngle;
    uniform float uSuctionCup;
    uniform float uGeometryStyle;
    uniform float uVibration;
    uniform float uTime;
    
    uniform float uMeshType;
    uniform float uShapeType;
    uniform float uRealisticVeins;
    uniform float uHeadType;
    uniform float uHeadScale;
    uniform float uFantasyType;
    uniform float uBaseType;
    uniform float uTaper;
    uniform float uHasOrifice;
    uniform float uOrificeType;
    uniform float uOrificeDepth;

    uniform sampler2D uTextTexture;
    uniform float uTextStyle;
    uniform float uTextDepth;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vec3 pos = position; // base cylinder is height 1.0, so y goes from -0.5 to 0.5
      float normY = pos.y + 0.5;

      if (uMeshType > 1.5 && uMeshType < 2.5) {
        // Balls: keep local sphere coordinates, do not bend or taper
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        vPosition = pos;
        gl_Position = projectionMatrix * mvPosition;
        return;
      }

      float normY_mapped = normY;
      if (uMeshType > 0.5 && uMeshType < 1.5 && uHasOrifice > 0.5) {
        float maxCoreHeight = 1.0 - uOrificeDepth - 0.08;
        normY_mapped = normY * maxCoreHeight;
        pos.y = normY_mapped - 0.5;
      }

      bool isOrificeCavity = false;
      if (uHasOrifice > 0.5 && (uMeshType < 0.5 || uMeshType > 1.5)) {
        float transitionNormY = 0.85;
        if (normY < transitionNormY) {
          normY_mapped = normY / transitionNormY;
          pos.y = normY_mapped - 0.5;
        } else {
          isOrificeCavity = true;
          float t_inner = (normY - transitionNormY) / (1.0 - transitionNormY);
          pos.y = 0.5 - uOrificeDepth * t_inner;
        }
      }

      float r_entrance = 0.16 * uShaftGirth;
      float shapeScale = uShaftGirth;
      
      if (isOrificeCavity) {
        float t_inner = (normY - 0.85) / 0.15;
        shapeScale = r_entrance * (1.0 - t_inner);
        float factor = 1.0;
        if (uOrificeType == 0.0) {
          factor = 1.0 + 0.16 * sin(t_inner * 18.0) * (1.0 - t_inner);
        } else if (uOrificeType == 1.0) {
          factor = 1.0 + 0.22 * sin(t_inner * 28.0) * (1.0 - t_inner);
        } else {
          factor = 1.0 + 0.12 * sin(t_inner * 12.0) * (1.0 - t_inner);
        }
        shapeScale *= factor;
      } else {
        if (uShapeType < 3.5) {
          // Apply base profile
          if (normY_mapped < 0.25) {
            float t = normY_mapped / 0.25;
            if (uBaseType == 0.0) {
              // Flared Suction Cup
              shapeScale = mix(uBaseGirth, uShaftGirth, t);
              if (uSuctionCup > 0.5 && normY_mapped < 0.1) {
                float t2 = normY_mapped / 0.1;
                float flare = pow(1.0 - t2, 2.2);
                shapeScale = mix(uBaseGirth, uBaseGirth * 2.3, flare);
              }
            } else if (uBaseType == 1.0) {
              // Flat base
              shapeScale = uBaseGirth;
            } else if (uBaseType == 2.0) {
              // Harness collar
              float groove = 0.0;
              if (normY_mapped > 0.08 && normY_mapped < 0.22) {
                float gt = (normY_mapped - 0.08) / 0.14;
                groove = 0.22 * sin(gt * 3.14159);
              }
              shapeScale = mix(uBaseGirth, uShaftGirth, t) - groove * uShaftGirth;
            }
          } 
          // Head curvature details
          else if (normY_mapped > 0.76) {
            float t = (normY_mapped - 0.76) / 0.24;
            float ridge = 0.0;
            float dome = sqrt(max(0.0, 1.0 - pow(t, 2.0)));
            float headRadius = uShaftGirth;
            
            if (uHeadType == 0.0) { // classic
              if (t < 0.25) ridge = 0.14 * sin((t / 0.25) * 3.14159);
              headRadius = (uShaftGirth + ridge) * dome;
            } else if (uHeadType == 1.0) { // realistic
              float angle = atan(pos.z, pos.x);
              float cleft = 0.035 * cos(angle * 2.0);
              if (t < 0.25) ridge = 0.18 * sin((t / 0.25) * 3.14159);
              headRadius = (uShaftGirth + ridge + cleft) * dome;
            } else if (uHeadType == 2.0) { // bulbous
              float bulb = 0.35 * uShaftGirth * sin(t * 3.14159 * 0.75);
              if (t < 0.2) ridge = 0.08 * uShaftGirth * sin((t / 0.2) * 3.14159);
              headRadius = (uShaftGirth * 1.1 + ridge + bulb) * dome;
            } else if (uHeadType == 3.0) { // tapered
              headRadius = uShaftGirth * dome * (1.0 - t * 0.35);
            } else if (uHeadType == 4.0) { // alien
              float alienRidge = 0.0;
              if (t < 0.25) alienRidge = 0.16 * uShaftGirth * sin((t / 0.25) * 3.14159);
              else if (t > 0.4 && t < 0.65) alienRidge = 0.12 * uShaftGirth * sin(((t - 0.4) / 0.25) * 3.14159);
              headRadius = (uShaftGirth + alienRidge) * dome;
            } else if (uHeadType == 5.0) { // dragon
              float dragonRidge = 0.0;
              if (t < 0.3) dragonRidge = 0.18 * uShaftGirth * sin((t / 0.3) * 3.14159);
              float segment = 0.08 * uShaftGirth * sin(t * 3.14159 * 3.0);
              headRadius = (uShaftGirth + dragonRidge + segment) * dome;
            }
            
            float scaleBlend = clamp((t - 0.0) / 0.25, 0.0, 1.0);
            scaleBlend = scaleBlend * scaleBlend * (3.0 - 2.0 * scaleBlend);
            float currentScale = mix(1.0, uHeadScale, scaleBlend);
            
            if (uHasOrifice > 0.5) {
              shapeScale = mix(r_entrance, headRadius * currentScale, 1.0 - pow(t, 4.0));
            } else {
              shapeScale = headRadius * currentScale;
            }
          }
        }

        // Taper (applied continuously across the main shaft body)
        float taperScale = mix(1.0 + uTaper * 0.20, 1.0 - uTaper * 0.45, normY_mapped);
        shapeScale *= taperScale;

        // Apply custom text displacement
        if (uTextStyle > 0.5) {
          float textVal = texture2D(uTextTexture, uv).r;
          float disp = 0.0;
          if (uTextStyle == 1.0) {
            disp = textVal * uTextDepth * 0.08;
          } else if (uTextStyle == 2.0) {
            disp = -textVal * uTextDepth * 0.08;
          }
          shapeScale += disp;
        }

        // Use Scenario shapes (Candle, Soap, Kitchenware, Collectible)
        if (uShapeType == 4.0) {
          // Candle: add longitudinal ridges, then apply spiral twist
          float angle = atan(pos.z, pos.x);
          shapeScale += 0.12 * sin(angle * 6.0);
        } else if (uShapeType == 5.0) {
          // Soap: square/rectangular block with chamfered look
          float angle = atan(pos.z, pos.x);
          float cos4 = cos(angle * 4.0);
          shapeScale *= (1.0 - 0.16 * cos4);
          if (normY_mapped < 0.15) {
            shapeScale *= smoothstep(0.0, 1.0, normY_mapped / 0.15);
          }
          if (normY_mapped > 0.85) {
            shapeScale *= smoothstep(0.0, 1.0, (1.0 - normY_mapped) / 0.15);
          }
        } else if (uShapeType == 6.0) {
          // Kitchenware (Muffin baking cup)
          float angle = atan(pos.z, pos.x);
          shapeScale = uShaftGirth * (0.7 + normY_mapped * 0.9);
          shapeScale += 0.07 * sin(angle * 18.0) * (0.2 + normY_mapped * 0.8);
          if (normY_mapped < 0.1) {
            shapeScale *= smoothstep(0.0, 1.0, normY_mapped / 0.1);
          }
        } else if (uShapeType == 7.0) {
          // Full-blown Chibi figurine mold!
          // 1. Base Stand: normY_mapped < 0.2
          // 2. Chibi Body: 0.2 <= normY_mapped < 0.55
          // 3. Chibi Head: 0.55 <= normY_mapped <= 1.0
          
          float angle = atan(pos.z, pos.x);
          float profile = 1.0;
          float featureOffset = 0.0;
          
          if (normY_mapped < 0.2) {
            // Base plate (slightly beveled octagonal base)
            float t = normY_mapped / 0.2;
            profile = 1.4 - 0.2 * t;
            // Make it slightly octagonal for a nice display stand look
            float oct = 0.04 * cos(angle * 8.0);
            profile += oct;
          } else if (normY_mapped < 0.55) {
            // Body section (waist is narrow, arms protrude at the sides)
            float t = (normY_mapped - 0.2) / 0.35; // 0 to 1
            // Tapered torso
            profile = 1.0 - 0.3 * sin(t * 3.14159);
            
            // Stubby chibi arms protruding outwards at the left/right sides (angle = 0 and Math.PI)
            float armProtrusion = 0.18 * pow(sin(t * 3.14159), 1.5) * max(0.0, cos(angle * 2.0));
            featureOffset += armProtrusion;
          } else {
            // Spherical Head!
            float t = (normY_mapped - 0.55) / 0.45; // 0 to 1
            // Spherical profile:
            float headRadiusFactor = 1.25;
            profile = headRadiusFactor * sqrt(max(0.0, 1.0 - pow(t * 2.0 - 1.0, 2.0)));
            
            // Add cute rounded ears (like a bear or cat) at the top sides of the head
            if (t > 0.7 && t < 0.95) {
              float earT = (t - 0.7) / 0.25;
              float earAngleFactor = max(0.0, cos(angle * 4.0 - 3.14159));
              float earProtrusion = 0.22 * sin(earT * 3.14159) * earAngleFactor;
              featureOffset += earProtrusion;
            }
            
            // Add a cute little face/nose protrusion on the front (angle = -PI/2)
            if (t > 0.3 && t < 0.6) {
              float faceT = (t - 0.3) / 0.3;
              float frontFactor = max(0.0, -sin(angle)); // Peaks at angle = -PI/2 (3PI/2)
              float noseProtrusion = 0.08 * sin(faceT * 3.14159) * pow(frontFactor, 4.0);
              featureOffset += noseProtrusion;
            }
          }
          
          shapeScale = uShaftGirth * (profile + featureOffset);
          pos.x = cos(angle);
          pos.z = sin(angle);
        }

        // Standard shape styles
        else if (uShapeType == 2.0) {
          // Fantasy geometries
          if (normY_mapped >= 0.25 && normY_mapped <= 0.76) {
            float angle = atan(pos.z, pos.x);
            if (uFantasyType == 0.0) {
              // Dragon: ridged nodes + scales
              float dragonKnot = 0.14 * sin(pos.y * 2.5);
              float scaleBump = 0.07 * cos(angle * 5.0 + pos.y * 9.0);
              shapeScale += dragonKnot + scaleBump;
            } else if (uFantasyType == 1.0) {
              // Alien: egg nodes + ribs
              float alienRidge = 0.16 * sin(pos.y * 3.5);
              float alienBumps = 0.04 * sin(angle * 3.0 + pos.y * 2.0);
              shapeScale += alienRidge + alienBumps;
            } else if (uFantasyType == 2.0) {
              // Tentacle: spiral rings
              float spiral = sin(pos.y * 5.5 - angle * 2.0);
              shapeScale += 0.12 * smoothstep(0.0, 1.0, spiral);
            }
          }
        } else {
          if (uGeometryStyle > 0.5 && uGeometryStyle < 1.5) {
            // Wave
            if (normY_mapped >= 0.25 && normY_mapped <= 0.76) {
              shapeScale += sin((normY_mapped - 0.25) * 22.0) * 0.07;
            }
          } else if (uGeometryStyle > 1.5) {
            // Ergonomic
            if (normY_mapped > 0.4 && normY_mapped < 0.76) {
              shapeScale -= sin((normY_mapped - 0.4) / 0.36 * 3.14159) * 0.14;
            }
          }
        }
      }

      // Apply inner core scaling
      if (uMeshType > 0.5 && uMeshType < 1.5) {
        // Inner Core: stop slightly below tip to stay internal
        float innerScale = 0.46;
        if (normY_mapped > 0.82) {
          float cap = (1.0 - normY_mapped) / 0.18;
          innerScale *= cap;
        }
        shapeScale *= innerScale;
      }
      // Apply internal tube scaling
      else if (uMeshType > 2.5 && uMeshType < 3.5) {
        shapeScale *= 0.06;
      }

      pos.x *= shapeScale;
      pos.z *= shapeScale;

      // Twist twist for Candle
      if (!isOrificeCavity && uShapeType == 4.0) {
        float theta = normY_mapped * 3.14159 * 2.0; 
        float c = cos(theta);
        float s = sin(theta);
        float rx = pos.x * c - pos.z * s;
        float rz = pos.x * s + pos.z * c;
        pos.x = rx;
        pos.z = rz;
      }

      float normY_physical = pos.y + 0.5;

      // Oval flat-head shaping for ergonomic curve / targeted
      if ((uGeometryStyle > 1.5 || uShapeType == 3.0) && normY_physical > 0.6) {
        float flatFactor = (normY_physical - 0.6) / 0.4;
        pos.z *= (1.0 - flatFactor * 0.28);
        pos.x *= (1.0 + flatFactor * 0.18);
      }

      // Curvature bend along X with tangent rotation to prevent shearing
      float bentY_offset = 0.0;
      float phi = (uCurvatureAngle * 3.14159) / 180.0;
      float cosP = cos(phi);
      float sinP = sin(phi);

      // Rotate to align with the bend axis (negative rotation)
      float x_rot = pos.x * cosP + pos.z * sinP;
      float z_rot = -pos.x * sinP + pos.z * cosP;

      float bentX_rot = x_rot;
      if (normY_physical > 0.25) {
        float curveT = (normY_physical - 0.25) / 0.75;
        float slope = 4.0 * curveT * curveT * uCurvature * 1.9;
        float denom = sqrt(1.0 + slope * slope);
        float cosT = 1.0 / denom;
        float sinT = -slope / denom;
        
        bentY_offset = x_rot * sinT;
        bentX_rot = x_rot * cosT + pow(curveT, 3.0) * uCurvature * 1.9;
      }

      // Rotate back to original space (positive rotation)
      pos.x = bentX_rot * cosP - z_rot * sinP;
      pos.z = bentX_rot * sinP + z_rot * cosP;

      // Scale height and apply relative Y bending offset
      pos.y = pos.y * uLength + bentY_offset;

      // Live vibration micro-ripple
      if (uVibration > 0.5) {
        pos.x += sin(uTime * 105.0 + pos.y * 18.0) * 0.007;
        pos.z += cos(uTime * 95.0 + pos.y * 15.0) * 0.007;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      vPosition = pos;
      gl_Position = projectionMatrix * mvPosition;
    }
`;

export const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform int uColorMode;
    uniform int uTextureStyle;
    uniform float uTime;
    uniform float uVibration;
    uniform float uLength;
    uniform float uShaftGirth;
    
    uniform float uMeshType;
    uniform float uShapeType;
    uniform float uRealisticVeins;
    uniform float uFantasyType;
    uniform float uBaseType;
    uniform float uTaper;
    uniform float uFirmness;
    uniform float uInclusions;
    uniform float uThermochromic;
    uniform float uBlacklightMode;
    uniform float uBallOffset;
    uniform float uBallYOffset;
    uniform float uAlpha;

    uniform sampler2D uTextTexture;
    uniform float uTextStyle;
    uniform float uTextDepth;

    // 3D hash & noise for seamless marble swirl
    float hash3(vec3 p) {
      p = fract(p * vec3(443.8975, 397.2973, 491.1871));
      p += dot(p.xyz, p.yzx + 19.19);
      return fract(p.x * p.y * p.z);
    }

    float noise3(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      vec3 u = f * f * (3.0 - 2.0 * f);
      
      return mix(
        mix(
          mix(hash3(i + vec3(0.0,0.0,0.0)), hash3(i + vec3(1.0,0.0,0.0)), u.x),
          mix(hash3(i + vec3(0.0,1.0,0.0)), hash3(i + vec3(1.0,1.0,0.0)), u.x),
          u.y
        ),
        mix(
          mix(hash3(i + vec3(0.0,0.0,1.0)), hash3(i + vec3(1.0,0.0,1.0)), u.x),
          mix(hash3(i + vec3(0.0,1.0,1.0)), hash3(i + vec3(1.0,1.0,1.0)), u.x),
          u.y
        ),
        u.z
      );
    }

    float fbm3(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      vec3 shift = vec3(100.0);
      for (int i = 0; i < 4; ++i) {
        v += a * noise3(p);
        p = p * 2.02 + shift;
        a *= 0.5;
      }
      return v;
    }

    // Finite difference bump mapping helper
    float getBump(vec3 pos, float normY, int textureStyle) {
      if (normY <= 0.22 || normY >= 0.78) return 0.0;
      
      float fade = smoothstep(0.22, 0.28, normY) * (1.0 - smoothstep(0.72, 0.78, normY));
      
      if (textureStyle == 1) { // Concentric Ribbed
        float arg = pos.y * 18.0;
        float s = sin(arg);
        float val = smoothstep(-0.3, 0.5, s);
        return val * 0.06 * fade;
      } 
      else if (textureStyle == 2) { // Helical Swirl
        float angle = atan(pos.z, pos.x);
        float arg = pos.y * 12.0 + angle * 4.0;
        float s = sin(arg);
        float val = smoothstep(-0.3, 0.5, s);
        return val * 0.06 * fade;
      } 
      else if (textureStyle == 3) { // Sensory Studded
        float angle = atan(pos.z, pos.x);
        float sY = sin(pos.y * 22.0);
        float sA = sin(angle * 12.0 + pos.y * 6.0);
        float studs = max(sY * sA, 0.0);
        return pow(studs, 2.5) * 0.08 * fade;
      }
      return 0.0;
    }

    // Organic wrinkly skin folds and veins for Realistic style
    float getRealisticSkinBump(vec3 pos, float normY, float realisticVeins, float meshType) {
      if (realisticVeins < 0.05) return 0.0;
      
      // Face/Glans of the head should be smoother, so we fade out at the very tip of the shaft
      float fade = 1.0;
      if (meshType < 0.5 && normY > 0.85) {
        fade = smoothstep(1.0, 0.85, normY);
      }
      
      // Horizontal skin wrinkles / folds
      // Stretched along Y axis (so pos.y frequency is higher)
      float foldsNoise = noise3(pos * vec3(1.5, 6.5, 1.5) + vec3(1.2, pos.y * 3.0, 0.5));
      float wrinkles = (foldsNoise - 0.5) * 0.045;
      
      // Micro-texture pores/creases
      float microPores = (noise3(pos * 28.0) - 0.5) * 0.012;
      
      // Veins
      float n1 = noise3(pos * vec3(1.5, 1.2, 1.5) + vec3(2.5, 4.1, 0.8));
      float vein1 = smoothstep(0.60, 0.65, n1) * (1.0 - smoothstep(0.65, 0.70, n1)) * 4.0;
      
      float n2 = noise3(pos * vec3(1.3, 1.4, 1.3) + vec3(-3.0, -2.0, 5.0));
      float vein2 = smoothstep(0.58, 0.63, n2) * (1.0 - smoothstep(0.63, 0.68, n2)) * 4.0;
      
      float veins = max(vein1, vein2) * 0.024;
      
      return (wrinkles + microPores + veins) * realisticVeins * fade;
    }

    float getCombinedBump(vec3 pos, float normY, int textureStyle, float shapeType, float realisticVeins, float meshType) {
      float b = getBump(pos, normY, textureStyle);
      if (shapeType > 0.5 && shapeType < 1.5) {
        float r = getRealisticSkinBump(pos, normY, realisticVeins, meshType);
        return b + r;
      }
      return b;
    }

    void main() {
      if (uMeshType > 2.5 && uMeshType < 3.5) {
        // Ejaculation Tube: opaque milk white
        gl_FragColor = vec4(0.96, 0.96, 0.98, 0.92);
        return;
      }

      vec3 normalVec = normalize(vNormal);
      vec3 viewVec = normalize(vViewPosition);
      vec3 lightVec = normalize(vec3(1.2, 1.5, 2.0));

      float normY = (vPosition.y + (uLength / 2.0)) / uLength;

      // Adjust coordinate system if this is a ball mesh
      vec3 adjPos = vPosition;
      if (uMeshType > 1.5 && uMeshType < 2.5) {
        adjPos.x += uBallOffset;
        adjPos.y += uBallYOffset;
        normY = (adjPos.y + (uLength / 2.0)) / uLength;
      }

      // 1. PROCEDURAL BUMP MAPPING via Finite Differences
      float bumpCenter = getCombinedBump(adjPos, normY, uTextureStyle, uShapeType, uRealisticVeins, uMeshType);
      
      vec3 tangent = vec3(0.0);
      if (abs(normalVec.y) < 0.99) {
        tangent = normalize(cross(normalVec, vec3(0.0, 1.0, 0.0)));
      } else {
        tangent = normalize(cross(normalVec, vec3(1.0, 0.0, 0.0)));
      }
      vec3 bitangent = cross(normalVec, tangent);
      
      float eps = 0.015;
      float bumpT = getCombinedBump(adjPos + tangent * eps, normY, uTextureStyle, uShapeType, uRealisticVeins, uMeshType);
      float bumpB = getCombinedBump(adjPos + bitangent * eps, normY, uTextureStyle, uShapeType, uRealisticVeins, uMeshType);
      
      float gradT = (bumpT - bumpCenter) / eps;
      float gradB = (bumpB - bumpCenter) / eps;
      
      normalVec = normalize(normalVec - tangent * gradT * 0.25 - bitangent * gradB * 0.25);

      if (uTextStyle > 0.5) {
        float textVal = texture2D(uTextTexture, vUv).r;
        float epsU = 0.003;
        float epsV = 0.005;
        float textValU = texture2D(uTextTexture, vUv + vec2(epsU, 0.0)).r;
        float textValV = texture2D(uTextTexture, vUv + vec2(0.0, epsV)).r;
        
        float gradU = (textValU - textVal) / epsU;
        float gradV = (textValV - textVal) / epsV;
        
        float bumpSign = (uTextStyle == 1.0) ? 1.0 : -1.0;
        float textStrength = uTextDepth * 0.16;
        
        normalVec = normalize(normalVec - tangent * gradU * bumpSign * textStrength - bitangent * gradV * bumpSign * textStrength);
      }

      // 2. CREVICE AMBIENT OCCLUSION (AO)
      float ao = 1.0;
      if (normY > 0.22 && normY < 0.78) {
        if (uTextureStyle == 1 || uTextureStyle == 2) {
          float normalizedBump = bumpCenter / (0.06 * smoothstep(0.22, 0.28, normY) * (1.0 - smoothstep(0.72, 0.78, normY)) + 0.0001);
          ao = mix(0.55, 1.0, smoothstep(0.0, 0.5, normalizedBump));
        } else if (uTextureStyle == 3) {
          float normalizedBump = bumpCenter / (0.08 * smoothstep(0.22, 0.28, normY) * (1.0 - smoothstep(0.72, 0.78, normY)) + 0.0001);
          ao = mix(0.65, 1.0, smoothstep(0.0, 0.4, normalizedBump));
        }
      }
      
      // Add AO for realistic skin folds/wrinkles
      if (uShapeType > 0.5 && uShapeType < 1.5 && uRealisticVeins > 0.05) {
        if (bumpCenter < 0.0) {
          ao = min(ao, mix(0.62, 1.0, smoothstep(-0.045, 0.0, bumpCenter)));
        }
      }
      
      float baseTransition = smoothstep(0.0, 0.18, normY);
      if (uMeshType < 1.5 || uMeshType > 2.5) {
        ao *= mix(0.6, 1.0, baseTransition);
      }

      // 3. MATERIAL COLOR (Solid / Liquid Marbled / Gradient / Split Pour)
      vec3 baseColor = uColor1;

      if (uMeshType > 0.5 && uMeshType < 1.5) {
        // Inner Core: slightly more saturated and solid
        baseColor = mix(uColor1 * 1.1, vec3(1.0), 0.15);
      } else {
        if (uColorMode == 1) {
          // Marble
          vec3 p = adjPos * 0.7;
          vec3 q = vec3(fbm3(p), fbm3(p + vec3(1.7, 3.2, 2.1)), fbm3(p + vec3(4.3, 0.9, 5.2)));
          vec3 r = vec3(fbm3(p + q * 2.5 + vec3(2.5, 4.3, 1.1)), fbm3(p + q * 1.8 + vec3(7.3, 1.9, 8.4)), fbm3(p + q * 2.2));
          float f = fbm3(p + r * 3.5 + vec3(uTime * 0.05, 0.0, 0.0));
          float mixTerm = smoothstep(0.15, 0.85, f);
          baseColor = mix(uColor1, uColor2, mixTerm);
        } else if (uColorMode == 2) {
          // Gradient
          baseColor = mix(uColor1, uColor2, normY);
        } else if (uColorMode == 3) {
          // Split Pour (wavy vertical split)
          float splitNoise = noise3(adjPos * vec3(1.6, 2.2, 1.6)) * 0.07;
          float splitLine = adjPos.x + splitNoise;
          baseColor = mix(uColor1, uColor2, smoothstep(-0.02, 0.02, splitLine));
        }
      }

      // Thermochromic Heat shift (flowing from tip)
      if (uThermochromic > 0.5 && (uMeshType < 0.5 || uMeshType > 1.5)) {
        float heatFactor = smoothstep(0.55, 0.95, normY + sin(uTime * 1.4) * 0.04);
        vec3 heatColor = vec3(0.96, 0.25, 0.45); // vibrant thermo-pink
        baseColor = mix(baseColor, heatColor, heatFactor);
      }

      // 4. PHOTOGRAPHIC LIGHTING WITH HALF-LAMBERT DIFFUSE
      float wrap = 0.5;
      float diff = max((dot(normalVec, lightVec) + wrap) / (1.0 + wrap), 0.0);

      // 5. FRESNEL & DUAL-LOBE SPECULARITY
      float fresnel = pow(1.0 - max(dot(normalVec, viewVec), 0.0), 4.5);
      
      vec3 halfVec = normalize(lightVec + viewVec);
      float specSharp = pow(max(dot(normalVec, halfVec), 0.0), 64.0) * 0.2;
      float specSatin = pow(max(dot(normalVec, halfVec), 0.0), 8.0) * 0.08;
      vec3 specularTotal = vec3(specSharp + specSatin) * mix(0.8, 1.4, fresnel);
      
      // Reflect reflections
      vec3 reflectVec = reflect(-viewVec, normalVec);
      float skyReflection = smoothstep(0.75, 0.98, reflectVec.z) * 0.14;
      skyReflection += smoothstep(0.8, 0.98, -reflectVec.x) * 0.1;
      vec3 envColor = vec3(skyReflection) * mix(vec3(0.5, 0.6, 0.8), vec3(1.0), skyReflection);

      // 7. SUBSURFACE SCATTERING (SSS) Backlit Rim glow
      float radialThickness = length(adjPos.xz) / (uShaftGirth * 1.5 + 0.0001);
      float thickness = radialThickness + bumpCenter * 2.0;
      
      if (normY > 0.76) {
        float tipFactor = (1.0 - normY) / 0.24;
        thickness *= smoothstep(0.0, 1.0, tipFactor);
      }
      
      float sssFactor = exp(-thickness * 2.5);
      float backlight = max(dot(-viewVec, lightVec), 0.0);
      vec3 sssColor = vec3(0.98, 0.35, 0.4) * sssFactor * (backlight * 0.7 + 0.3) * 0.45;

      // 8. FINAL SHADING BLEND
      vec3 finalColor = baseColor * (0.24 + diff * 0.76) * ao + specularTotal + sssColor + envColor;

      // Inclusions (Glitter / Metallic)
      if (uInclusions > 0.5 && uInclusions < 1.5) {
        // Glitter sparkle specks
        float sparkleNoise = hash3(floor(adjPos * 85.0));
        if (sparkleNoise > 0.93) {
          vec3 flakeNormal = normalize(normalVec + (vec3(
            hash3(adjPos * 90.0),
            hash3(adjPos * 95.0),
            hash3(adjPos * 100.0)
          ) - 0.5) * 0.7);
          float flakeSpec = pow(max(dot(flakeNormal, halfVec), 0.0), 128.0);
          float sparkle = smoothstep(0.85, 1.0, flakeSpec) * 3.5;
          float twinkle = sin(uTime * 4.5 + sparkleNoise * 12.0) * 0.45 + 0.55;
          specularTotal += vec3(sparkle * twinkle) * vec3(0.95, 0.98, 1.0);
        }
      }
      
      if (uInclusions > 1.5 && uInclusions < 2.5) {
        // Metallic sheen
        specularTotal *= 2.2;
        vec3 metalSheen = mix(vec3(1.0), vec3(1.0, 0.82, 0.4), 0.5);
        finalColor += envColor * metalSheen * 0.7;
      }

      if (uVibration > 0.5) {
        float glowPulse = sin(uTime * 20.0) * 0.06 + 0.06;
        finalColor += vec3(0.95, 0.2, 0.6) * glowPulse;
      }

      // Blacklight UV / Fluorescent Glow
      if (uBlacklightMode > 0.5) {
        // Dim the normal reflections
        finalColor = mix(finalColor * 0.15, finalColor, 0.1);
        
        // Fluorescent base glow
        vec3 uvGlow = vec3(0.18, 0.05, 0.45) * 0.35;
        
        // Convert baseColor to fluorescent emission
        float brightness = dot(baseColor, vec3(0.299, 0.587, 0.114));
        vec3 neonColor = mix(vec3(0.9, 0.1, 0.75), vec3(0.1, 0.85, 0.9), sin(adjPos.y * 1.5 + uTime) * 0.5 + 0.5);
        vec3 fluorEmission = neonColor * brightness * 0.8;
        
        finalColor += uvGlow + fluorEmission;
        
        // Glow pigment
        if (uInclusions > 2.5 && uInclusions < 3.5) {
          finalColor += vec3(0.2, 0.95, 0.35) * 0.85;
        }
      }

      float finalAlpha = uAlpha;
      if (uAlpha < 0.95) {
        // Jelly silicone translucency: vibrant color saturation boost
        float lum = dot(finalColor, vec3(0.299, 0.587, 0.114));
        finalColor = mix(vec3(lum), finalColor, 1.6); // Boost saturation for jelly depth
        finalColor = max(finalColor, vec3(0.0));

        // Fresnel opacity: glassy edges are fully opaque, center shows through
        float edgeOpacity = pow(fresnel, 0.8) * 0.85;
        float bodyOpacity = uAlpha * 0.55;
        finalAlpha = bodyOpacity + edgeOpacity;
        finalAlpha = clamp(finalAlpha, 0.0, 1.0);

        // Specular highlights punch through as fully opaque
        float specBrightness = max(specularTotal.r, max(specularTotal.g, specularTotal.b));
        finalAlpha = max(finalAlpha, specBrightness * 2.0);
        finalAlpha = max(finalAlpha, max(envColor.r, envColor.g) * 1.5);
        finalAlpha = clamp(finalAlpha, 0.0, 1.0);
      }

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
`;
