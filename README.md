# CVLIB - Cinema Viewer Library

CVLIB is a library which provides a JavaScript API to Paraview Cinema databases for visualization in the Browser.

In contrast to other Cinema viewers this library is focusing on modular expandability. Most applications have additional viewer requirements such as specialized data visualizations, aggregations, interactions, and other features a generic all-in-one viewer can not provide. Hence, CVLIB provides functions to access Cinema databases, process queries, create viewer UI elements, render results, and interact with the visualization so that users can build their own custom viewer.

### Architecture
CVLIB follows a simple system architecture. It provides the following classes:
* **Parameter**: a parameter which can be queryied (e.g. camera angle, iso-value, time, ...)
* **QuerySet**: a set of Parameters
* **ResultSet**: a response to a QuerySet (e.g. images, graphs, numbers, ...)
* **Database**: provides an interface to the Cinema database and processes QuerySets
* **Renderer**: renders ResultSets
* **UIFactory**: generates HTML widgets to request QuerySets and display rendered ResultSets
* **Controls**: augments HTML widgets elements with mouse interactions such as panning and zooming

A Cinema database is interfaced via the Database class which can process QuerySets. The database will respond with ResultSets which can be rendered with the Renderer. For instance, if the ResultSet contains a collection of depth and diffuse images the renderer is able to composite the images with correct occlusion culling. The UIFactory can generate HTML widgets to adjust QuerySets via input elements and display output from the Renderer with viewports. The different Control classes enable users to zoom, pan, and rotate viewports.

All classes can easily be extended to deal with different Cinema databases, more complex rendering pipelines, or application specific data interactions. For Instance, CVLIB provides the classes DatabaseSpecA and DatabaseSpecC which both are subclasses of Database and process QuerySets according to their respective Spec implementations. For a detailed description of all available classes see the **Documentation**.
