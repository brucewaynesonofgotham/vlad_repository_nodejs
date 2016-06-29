//
// Profile view
//
define([
    "i18n",
    "text!templates/profile/viewer.html"
], function(i18n, template) {
    console.log('views/profile/viewer.js');
    var View = Backbone.View.extend({
        initialize: function() {
            // Templates
            this.templates = _.parseTemplate(template);
            // Exam model
            var Profile = Backbone.Model.extend({
                urlRoot: 'profile'
            });
            this.model = new Profile();
            this.render();
        },
        destroy: function() {
            this.remove();
        },
        render: function() {
            var self = this;
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n
            };
            this.loadingMsg = tpl(data);
            var dialog = $(this.el).dialog({
                title: i18n.t('user.title'),
                width: 500,
                height: 280,
                closed: true,
                modal: true,
                content: this.loadingMsg,
                buttons: [{
                    text: i18n.t('user.close'),
                    iconCls: 'fa fa-times',
                    handler: function() {
                        self.doClose();
                    }
                }],
                onOpen: function() {
                    $(this).dialog('center');
                }
            });
            this.$Dialog = $(dialog);
            this.$Container = this.$Dialog.find('.dialog-container');
            return this;
        },
        doOpen: function(userId) {
            var self = this;
            this.$Container.html(this.loadingMsg);
            var tpl = _.template(this.templates['dialog-tpl']);
            this.model.clear();
            this.model.set('_id', userId);
            this.model.fetch({
                success: function(model) {
                    var data = {
                        i18n: i18n,
                        user: model.toJSON()
                    };
                    self.$Container.html(tpl(data));
                }
            });
            this.$Dialog.dialog('open');
        },
        doClose: function() {
            this.$Dialog.dialog('close');
        }
    });
    return View;
});