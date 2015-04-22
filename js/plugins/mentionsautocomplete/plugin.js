/**
 * @file
 * Mentions Autocomplete CKEditor plugin.
 */

(function ($, Drupal, drupalSettings, CKEDITOR) {

  "use strict";
  CKEDITOR.plugins.add('mentionsautocomplete', {
      init: function (editor) {
          editor.mentions = [];
          editor.on('contextMenu', function(evt){
              var i=3;
          });
          editor.contextMenu.addListener(function(startElement, selection, path){
              var selectiontype = selection.getType();
              if (selection.getType() !== CKEDITOR.SELECTION_TEXT) {
                  return;
              }
              var editor = selection.root.editor;
              return editor.mentions.reduce(function(prev,curr,index,array) {
                  var newValue = prev;
                  newValue[curr] = CKEDITOR.TRISTATE_OFF;
                  return newValue;
              }, {});
          });
          editor.addCommand('mentionsautocomplete', {
                modes: {wysiwyg: 1},
                exec: function(editor) {
                    $.ajax({
                        type: 'GET',
                        url: '/mentions/views/userlist',
                        success: function(data) {
                            var users = JSON.parse(data);
                            var username, userid;
                            
                            //var editorid = editor.name;
                            //var range = editor.getSelection().getRanges()[ 0 ],
                            //rangeRoot = range.root,
                            //startNode = range.startContainer;
                            //var selection = editor.getSelection();
                            //var bookmarks = selection.createBookmarks(true);
                         
                            if (editor.contextMenu) {
                                editor.addMenuGroup('Mentions');
                                editor.removeMenuItem('paste');
                            }
                            
                            users.forEach(function(user, index, userarray){
                                username = user.name;
                                userid = user.uid;
                                
                                if (editor.contextMenu) {
                                    editor.addCommand('mentions_' + username, {
                                    modes: {wysiwyg: 1},
                                    exec: function(editor) {
                                        var command = this.name.replace('mentions_','');
                                        //var commands = editor.commands;
                                        var range = editor.getSelection().getRanges()[ 0 ];
                                        var rangenew = editor.createRange();
                                        //rangenew.setStartAt(editor.getSelection())                
//rangenew.moveToElementEditEnd( rangenew.root );
                                        //rangenew.startOffset = rangenew.startOffset - 1;
                                        //editor.getSelection().selectRanges( [rangenew] );
                                        //var selection = editor.getSelection();
                                        //var selectedElement = selection.getSelectedElement();
                                        //selectedElement.setHtml('i wonder');
                                        editor.insertHtml(command);
                                    }                                         
                                    });
                                    editor.addMenuItem(username, {
                                        id: 'mentions_' + userid,
                                        label: username,
                                        group: 'Mentions',
                                        command: 'mentions_' + username
                                    });
                                    
                                    editor.mentions.push(username);
                                    
                                    var menuitem = editor.getMenuItem(username);
                                    
                                    var range = editor.getSelection().getRanges()[ 0 ];
                                    var offset = range.endOffset;
                                    //range.moveToPosition( range.root, CKEDITOR.POSITION_BEFORE_END );
                                    var startNode = range.endContainer;
                                    //editor.getSelection().selectRanges( [ range ] );
                                    editor.contextMenu.show(startNode.getParent(), null,offset*7);
                                }
                                
                                
                            });
                            

                        }
                    });
                }
          });
      },
      afterInit: function(editor) {
          editor.on('key', function(evt) {
            if (evt.data.keyCode === CKEDITOR.SHIFT + 50) {
               evt.data.domEvent.preventDefault();
               editor.execCommand('mentionsautocomplete');
           }
      });
     }
  });
  
})(jQuery, Drupal, drupalSettings, CKEDITOR);

