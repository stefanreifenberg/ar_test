<script lang="js">
	import * as THREE from 'three'
	import { T,useThrelte } from '@threlte/core'
	import { useRatk } from '$lib/ratk.js'
	import { Text, RoundedBoxGeometry } from '@threlte/extras'
	import { Flex, Box } from '@threlte/flex'
	import Label from './Label.svelte'
	import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
	import { pointerControls, useXR } from '@threlte/xr'

	const ratk = useRatk()
	const group = new THREE.Group()

	const { isPresenting } = useXR()
	pointerControls('left')
	pointerControls('right')

	// create a function to change the color of the button
	const changeColor = () => {
      // if the color is #404550, change it to #96ffba
      if (color === '#404550') {
          color = '#96ffba'
      } else {
          // if the color is #96ffba, change it to #404550
          color = '#404550'
      }
  }
	

	let enabled = true
	let meshes = []
    let objects = []

	const vec3 = new THREE.Vector3()

	ratk.onMeshAdded = (mesh) => {

		// wait for 5 seconds before adding the mesh
		setTimeout(() => {
			meshes = [...ratk.meshes]

			for (const mesh of ratk.meshes) {
				if (mesh.meshMesh === undefined) {
					continue
				}

				mesh.meshMesh.material = new THREE.MeshBasicMaterial({
					wireframe: true,
					color: Math.random() * 0xffffff,
				});
			}

			objects.splice(0, objects.length)

			for (const mesh of ratk.meshes) {
        console.log("mesh", mesh)
				if (mesh.meshMesh === undefined) {
					continue
				}

				objects.push(mesh)
			}

			objects = objects
      console.log("meshes objects", objects)

			const [object] = objects

			if (!object) {
				enabled = false
				return
			}

			group.position.set(object.position.x, object.position.y, object.position.z)
			group.lookAt(0, 0, 0)
			enabled = true
		}, 5000)
	}

	function exportGLTF() {
    

    const gltfExporter = new GLTFExporter();
    
    
    gltfExporter.parse(
	  meshes,
      function ( result ) {
    
        if ( result instanceof ArrayBuffer) {
          console.log( result );
    
          saveArrayBuffer( result, 'scene.glb' );
    
        } else {
    
          const output = JSON.stringify( result, null, 2 );
          console.log( output );
          saveString( output, 'scene.gltf' );
    
        }
    
      },
      function ( error ) {
    
        console.log( 'An error happened during parsing', error );
    
      }
    );
    
    }
    
    const link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link ); // Firefox workaround, see #6594
    
    function save( blob, filename ) {
    
    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
    
    // URL.revokeObjectURL( url ); breaks Firefox...
    
    }
    
    function saveString( text, filename ) {
    
      save( new Blob( [ text ], { type: 'text/gltf' } ), filename );
    
    }
    
    
    function saveArrayBuffer( buffer, filename ) {
    
    save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
    
    }

	let ref2
	let color = '#404550'
    let text = 'Download Model'
</script>

<Flex width={3} height={1}>

    <T.Mesh
      bind:ref2
      position.z={-4}
      position.y={1}
      on:click={exportGLTF}
      on:pointerenter={changeColor}
    on:pointerleave={changeColor}
    >
      <RoundedBoxGeometry
        args={[1, 0.3, 0.3]}
        radius={0.1}
      />
      <T.MeshBasicMaterial color={color} />
      <Label
        z={0.2}
        {text}
      />
    </T.Mesh>
</Flex>


{#each objects as object}
	<T is={object} visible={true}/>
{/each}

{#if enabled}
	<T is={group}>
		<slot />
	</T>
{/if}

{#each meshes as mesh}
	{@const size = mesh.meshMesh?.geometry.boundingBox?.getSize(vec3) ?? { x: 0, y:0, z: 0 }}
	<T is={mesh} visible={true} />
{/each}