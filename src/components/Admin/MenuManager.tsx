
import { useState } from 'react';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grip, Trash2, Plus } from 'lucide-react';
import { MenuItem } from '@/data/initialData';

export const MenuManager = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems } = useSite();
  const [items, setItems] = useState<MenuItem[]>(
    [...menuItems].sort((a, b) => a.order - b.order)
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    label: '',
    url: '',
    order: menuItems.length,
  });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('dragIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = Number(e.dataTransfer.getData('dragIndex'));
    if (dragIndex === dropIndex) return;

    const newItems = [...items];
    const draggedItem = newItems[dragIndex];
    
    // Remove the dragged item
    newItems.splice(dragIndex, 1);
    
    // Insert it at the drop position
    newItems.splice(dropIndex, 0, draggedItem);
    
    // Update order values
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));
    
    setItems(reorderedItems);
    reorderMenuItems(reorderedItems);
  };

  const handleEditItem = (id: string) => {
    setEditingId(id);
  };

  const handleUpdateItem = (id: string, field: keyof MenuItem, value: string) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const handleSaveItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      updateMenuItem(id, item);
    }
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      deleteMenuItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.label || !newItem.url) {
      return;
    }
    
    addMenuItem(newItem);
    
    // Reset the form
    setNewItem({
      label: '',
      url: '',
      order: items.length + 1,
    });
    
    // Refresh the items list
    setItems([...items, { ...newItem, id: 'temp-id' }]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Menu Manager</h1>
        <p className="text-muted-foreground">
          Drag and drop menu items to reorder them
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 border rounded-md"
                >
                  <div className="cursor-move text-gray-400">
                    <Grip size={16} />
                  </div>
                  
                  {editingId === item.id ? (
                    <>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          value={item.label}
                          onChange={(e) => handleUpdateItem(item.id, 'label', e.target.value)}
                          placeholder="Menu Label"
                        />
                        <Input
                          value={item.url}
                          onChange={(e) => handleUpdateItem(item.id, 'url', e.target.value)}
                          placeholder="URL"
                        />
                      </div>
                      <Button size="sm" onClick={() => handleSaveItem(item.id)}>
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.url}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditItem(item.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No menu items yet. Add some below.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Menu Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-label">Label</Label>
                <Input
                  id="new-label"
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                  placeholder="Menu Label"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-url">URL</Label>
                <Input
                  id="new-url"
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  placeholder="e.g., /category/technology"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full md:w-auto">
              <Plus size={16} className="mr-2" />
              Add Menu Item
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
