# LearnWebGL
learnopengl.com系列教程的WebGL实现版本，本项目使用webgl+typescript的组合对该教程教学内容进行实现，方便仅会前端语言的图形学爱好者或者想接触webgl的程序猿学习交流。由于本人并不是从事前端工作，对前端语言不够了解，所以部分代码编写得不够完美，欢迎大家指点交流。本项目力求使用webgl+typescript还原教程中opengl+cpp的代码，尽可能做到内容的差异仅来自于语言的差异。目前正努力施工中……
  
**英文教程**：[learnopengl](https://learnopengl.com/)  
**中文教程**：[learnopengl-cn](https://learnopengl-cn.github.io/)
  
## 近况
进度过半，发现webgl-1.0的不完备已经严重影响到本项目的完整性（项目初期没有意识到webgl 1.0版本和2.0版本的问题），所以现在决定暂时停止向后更新，先使用webgl-2.0重构完之前的代码之后再继续更新。不过，根据对webgl-2.0的了解，仍有一些opengl的功能该版本未支持，比如几何着色器。之后我会做考量，要么选择替代技术，要么直接放弃，谅解。  
  
## 当前进度：
>- src
>   - 1.getting started
>       - 1.2.hello_window_clear
>       - 2.1.hello_triangle
>       - 2.2.hello_triangle_indexed
>       - 2.3.hello_triangle_exercise1
>       - 2.4.hello_triangle_exercise2
>       - 2.5.hello_triangle_exercise3
>       - 3.1.shaders_uniform
>       - 3.2.shaders_interpolation
>       - 3.3.shaders_class
>       - 3.4.shaders_class_exercise1
>       - 3.5.shaders_class_exercise2
>       - 3.6.shaders_class_exercise3
>       - 4.1.textures
>       - 4.2.textures_combined
>       - 4.3.textures_exercise1
>       - 4.4.textures_exercise2
>       - 4.5.textures_exercise3
>       - 4.6.textures_exercise4
>       - 5.1.transformations
>       - 5.2.transformations_exercise1
>       - 5.3.transformations_exercise2
>       - 6.1.coordinate_systems
>       - 6.2.coordinate_systems_depth
>       - 6.3.coordinate_systems_exercise3
>       - 6.4.coordinate_systems_multiple
>       - 7.1.camera_cirle
>       - 7.2.camera_keyboard_dt
>       - 7.4.camera_class
>   - 2.lighting
>       - 1.colors
>       - 2.1.basic_lighting_diffuse
>       - 2.2.basic_lighting_specular
>       - 2.3.basic_lighting_specular_exercise1
>       - 2.4.basic_lighting_specular_exercise3
>       - 2.5.basic_lighting_specular_exercise4
>       - 3.1.materials
>       - 3.2.materials_exercise1
>       - 4.1.lighting_maps_diffuse_map
>       - 4.2.lighting_maps_specular_map
>       - 4.3.lighting_maps_exercise4
>       - 5.1.light_casters_directional
>       - 5.2.light_casters_point
>       - 5.3.light_casters_spot
>       - 5.4.light_casters_spot_soft
>       - 6.multiple_lights
>       - 7.multiple_lights_plus
>   - 3.model_loading
>       - 1.model_loading(为了之后加载obj模型，我用typescript写了一个只针对该教程中obj格式文件的解析函数,此处与原教程差别较大)
>   - 4.advanced_opengl
>       - 1.1.depth_testing
>       - 1.2.depth_testing_view
>       - 2.stencil_testing
>       - 3.1.blending_discard
>       - 3.2.blending_sort
>       - 5.1.framebuffers
>       - 5.2.framebuffers_inversion
>       - 5.3.framebuffers_grayscale
>       - 5.4.framebuffers_kernel_effects
>       - 5.5.framebuffers_blur
>       - 5.6.framebuffers_edge_detection
>       - 5.7.framebuffers_exercise1
>       - 6.1.cubemaps_skybox
>       - 6.2.cubemaps_environment_mapping
>       - 6.3.modeling_environment_mapping
>       - 10.1.instancing
>   - 7.in_practice(这是该教程的最后章节，根据目前更新的进度，已经能够完成一个完整的Breakout2D小游戏了，采用到的技术即目前的进度处的运用帧缓存进行后期处理以及之前的内容)
  
## 说明
本项目仅供交流学习，不可用于其他用途，如果有人愿意提供宝贵的意见或建议，可联系本人。
