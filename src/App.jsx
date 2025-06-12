import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';

const App = () => {
  const viewerDiv = useRef(null);
  const [openForm, setOpenForm] = useState(false);
  const [title, setTitle] = useState('');
  const [destType, setDestType] = useState('page'); // 'page' or 'coords'
  const [pageNum, setPageNum] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    WebViewer({
      path: '/webviewer/lib',
      initialDoc: '/files/PDFTRON_about.pdf',
    }, viewerDiv.current).then(instance => {
      const { UI } = instance;

      UI.setHeaderItems(header => {
        header.push({
          type: 'actionButton',
          title: 'Add Outline',
          img: 'https://img.icons8.com/ios-filled/24/bookmark-ribbon.png',
          onClick: () => setOpenForm(true),
        });
      });

      viewerDiv.current.instance = instance;
    });
  }, []);

  const handleSubmit = async () => {
    const { documentViewer, UI } = viewerDiv.current.instance;
    const pdfDoc = await documentViewer.getDocument().getPDFDoc();

    await pdfDoc.lock();

    let destination;
    if (destType === 'page') {
      const page = await pdfDoc.getPage(pageNum);
      destination = await pdfDoc.createDestination(page, 0, 0, 1);
    } else {
      const page = await pdfDoc.getPage(documentViewer.getCurrentPage());
      destination = await pdfDoc.createDestination(page, Number(x), Number(y), 2);
    }

    const bm = await pdfDoc.createBookmark(title || 'New Outline');
    bm.setAction(await pdfDoc.createGoToAction(destination));
    pdfDoc.addRootBookmark(bm);

    await pdfDoc.unlock();
    UI.openElements(['leftPanel']);
    UI.setActiveLeftPanel('bookmarksPanel');
    UI.loadOutline();

    setOpenForm(false);
  };

  return (
    <>
      <div ref={viewerDiv} style={{ height: '100vh' }} />
      {openForm && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Add Outline</h3>
            <label>Title:<br/><input value={title} onChange={e => setTitle(e.target.value)}/></label>
            <br/>
            <label>
              Destination:<br/>
              <select value={destType} onChange={e => setDestType(e.target.value)}>
                <option value="page">Page #</option>
                <option value="coords">Coordinates</option>
              </select>
            </label>
            {destType === 'page' ? (
              <label>Page Number:<br/><input type="number" value={pageNum} onChange={e => setPageNum(e.target.value)}/></label>
            ) : (
              <>
                <label>X:<br/><input type="number" value={x} onChange={e => setX(e.target.value)}/></label><br/>
                <label>Y:<br/><input type="number" value={y} onChange={e => setY(e.target.value)}/></label>
              </>
            )}
            <br/><button onClick={handleSubmit}>Add</button>
            <button onClick={() => setOpenForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

const overlay = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};
const modal = {
  background: '#fff', padding: 20, borderRadius: 8
};

export default App;
