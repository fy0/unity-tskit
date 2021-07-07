using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using FairyGUI;
using UnityEngine;
using Puerts;
using UnityEngine.Events;
using UnityEngine.SceneManagement;
using Object = System.Object;

namespace game
{
    public class Main : MonoBehaviour
    {
        // 注：命名风格上全面迁就js
        static JsEnv _jsEnv;
        public static Action<float> jsUpdate;
        public static Action<float> jsFixedUpdate;
        public static UIPanel uiMainPanel;
        public static Main main;
        public static string scriptPath;

        public Camera camera;
        public Anchor playerAnchor;

        public void Exit()
        {
#if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
#else
        Application.Quit();
#endif
        }

        private void Awake()
        {
            DontDestroyOnLoad(this);
        }

        void Start()
        {
            Main.main = this;
            if (_jsEnv != null) {
                // 单例
                GameObject.Destroy(this);
                return;
            }

            // 注：脚本的实际路径是 Main.scriptPath/tsbuild
            // 这里
            Main.scriptPath = Path.Combine(UnityEngine.Application.dataPath, "Resources");
            var loader = new DefaultLoader(Main.scriptPath);
            Debug.Log(Main.scriptPath);
            _jsEnv = new JsEnv(loader);
            // _jsEnv.WaitDebugger();

            _jsEnv.UsingAction<float>();
            _jsEnv.UsingAction<Scene, LoadSceneMode>();
            _jsEnv.UsingAction<int, FairyGUI.GObject>(); // FairyGUI.ListItemRenderer 
            Main.uiMainPanel = gameObject.GetComponentInChildren<UIPanel>();

            camera = gameObject.GetComponentInChildren<Camera>();

            foreach (var a in gameObject.GetComponentsInChildren<Anchor>()) {
                if (a.name == "playerAnchor") {
                    this.playerAnchor = a;
                }
            }

            camera = gameObject.GetComponentInChildren<Camera>();
            
            _jsEnv.Eval("console.log('脚本引擎启动')");
            _jsEnv.Eval("require('tsbuild/bundle')");
        }

        void Update()
        {
            // 暂时先不考虑timeScale这回事吧
            jsUpdate?.Invoke(Time.deltaTime);
        }

        void FixedUpdate()
        {
            jsFixedUpdate?.Invoke(Time.fixedDeltaTime);
        }
    }
}
