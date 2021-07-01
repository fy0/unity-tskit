using UnityEngine;
using UnityEngine.Serialization;

namespace game
{
    public class Anchor : MonoBehaviour
    {
        public MeshFilter meshFilter;
        [FormerlySerializedAs("MeshRenderer")] public MeshRenderer meshRenderer = new MeshRenderer();


        // Start is called before the first frame update
        void Start()
        {
        }

        // Update is called once per frame
        void Update()
        {

        }
    }
}
