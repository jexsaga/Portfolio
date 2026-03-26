// This code was written with the help of ChatGPT

export function loadMesh(objContent) {
    const positions = [];
    const normals   = [];
    const uvs       = [];
    const indices   = [];
    const vertexMap = new Map();
    const vertexData = [];

    let nextIndex = 0;
    const lines = objContent.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const parts = trimmed.split(/\s+/);
        const cmd = parts[0];
        if (cmd === 'v') {
            positions.push([+parts[1], +parts[2], +parts[3]]);
        } else if (cmd === 'vn') {
            normals.push([+parts[1], +parts[2], +parts[3]]);
        } else if (cmd === 'vt') {
            uvs.push([+parts[1], 1.0 - +parts[2]]);
        } else if (cmd === 'f') {
            // triangulate polygon
            for (let i = 1; i + 2 < parts.length; i++) {
                const tri = [parts[1], parts[i+1], parts[i+2]];
                for (const vert of tri) {
                    const [pidx, tidx, nidx] = vert.split('/').map(s => s === '' ? -1 : parseInt(s,10) - 1);
                    const key = `${pidx}/${tidx}/${nidx}`;
                    let idx = vertexMap.get(key);
                    if (idx === undefined) {
                        const pos = positions[pidx];
                        const norm = nidx >= 0 ? normals[nidx] : [0,0,0];
                        const uv   = tidx >= 0 ? uvs[tidx] : [0,0];
                        vertexData.push(
                            pos[0], pos[1], pos[2],
                            norm[0], norm[1], norm[2],
                            uv[0], uv[1]
                        );
                        idx = nextIndex++;
                        vertexMap.set(key, idx);
                    }
                    indices.push(idx);
                }
            }
        }
    }

    const vertexCount = nextIndex;
    const finalPositions = new Float32Array(vertexCount * 3);
    const finalNormals   = new Float32Array(vertexCount * 3);
    const finalUVs       = new Float32Array(vertexCount * 2);

    for (let i = 0; i < vertexCount; ++i) {
        finalPositions.set(vertexData.slice(i*8,   i*8+3), i*3);
        finalNormals.set(  vertexData.slice(i*8+3, i*8+6), i*3);
        finalUVs.set(      vertexData.slice(i*8+6, i*8+8), i*2);
    }

    return {
        positions: finalPositions,
        normals:   finalNormals,
        uvs:       finalUVs,
        indices:   new Uint32Array(indices)
    };
}