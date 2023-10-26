# CavityQuest
**Cavity Detection AI Tool**
This thesis aims to create a cavity detection AI tool using YOLOv7, Electron, React, Fribase, and Roboflow.
![image](https://github.com/renzo-1/CavityQuest/assets/125778691/0b791be8-73a0-4986-9c78-0a2a1ddd55ee)

**Introduction**
Cavities are a common dental problem that can cause pain, infection, and tooth loss. Early detection and treatment of cavities is important to prevent these complications. However, traditional methods of cavity detection, such as visual inspection by a dentist, can be time-consuming and inaccurate.
The proposed solution is to create a cavity detection AI tool that uses YOLOv7, Electron, React, and Firebase, to detect cavities in teeth. YOLOv7 is a deep learning object detection model that can be used to detect objects in images. 

The dataset came from Robolofow, and it comes pre-annotated and is segmented into three categories: 988 images for training, 279 for validation, and 125 for testing purposes.
YOLOv7 is trained on the pre-processed images.
The trained YOLOv7 model is used to detect cavities in new images/realtime video.
An Electron app is be created to allow users to have realtime tooth detection of tooth decay. The app also includes a patient record system, which enables the dentists to make treatment planning.

**Results**
The results of the proposed solution is evaluated using the following metrics:

Mean Average Precision: The Mean Average Precision (mAP) serves as the prevailing benchmark metric employed by the computer vision research community for assessing the resilience and performance of object detection model.
Inference Time: The inference time is how long is takes for a forward propagation.
Precision-Recall Curve: It is a graphical representation of the trade-off between precision and recall at different confidence score thresholds.
![image](https://github.com/renzo-1/CavityQuest/assets/125778691/14e43dce-5023-44f6-901f-d86723e2bbf8)

**References**
YOLOv7: https://github.com/WongKinYiu/yolov7
Electron: https://electronjs.org/
React: https://react.dev/
Firebase: https://firebase.google.com/
Roboflow: https://roboflow.com/

