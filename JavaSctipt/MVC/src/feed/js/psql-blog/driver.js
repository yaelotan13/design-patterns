import '../../style/main.css';
import getController from './controller/app';
import getView from './view/view';
import getModel from './model/psql-model';

const server = getModel();
const webView = getView();
const app = getController(server, webView);
